import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { Project } from '../../../../_model/Project';
import { levenshteinDistance } from '../../../_utils/levenshtein.distance';
import { config } from '../../../../_data/config.data';
import { clearStringUtil } from '../../../_utils/clear-string.util';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-cards-filter',
    templateUrl: './cards-filter.component.html',
    styleUrls: ['./cards-filter.component.sass'],
})
export class CardsFilterComponent implements AfterViewInit {
    @Input()
    public projects: Project[];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    // @ViewChild('searchInput')
    // public searchInput: ElementRef<HTMLInputElement>;

    // TODO: Refactor
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    formControl = new FormControl();
    filteredProjectTags: Observable<string[]>;
    projectTags: string[] = [];
    allProjectTags: string[] = []; // TODO: build this array

    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

    constructor() {
        this.filteredProjectTags = this.formControl.valueChanges.pipe(
            startWith(null),
            map((projectTag: string | null) =>
                projectTag
                    ? this._filter(projectTag)
                    : this.allProjectTags.slice(),
            ),
        );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allProjectTags.filter(fruit =>
            fruit.toLowerCase().includes(filterValue),
        );
    }

    public add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            this.projectTags.push(value);
        }

        // Clear the input value
        event.input.value = '';

        this.formControl.setValue(null);
    }

    public remove(fruit: string): void {
        const index = this.projectTags.indexOf(fruit);

        if (index >= 0) {
            this.projectTags.splice(index, 1);
        }
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.projectTags.push(event.option.viewValue);
        this.searchInput.nativeElement.value = '';
        this.formControl.setValue(null);
    }

    // TODO: End Refactor

    public ngAfterViewInit(): void {
        // this.searchInput.nativeElement.onchange = () => this.applySearch();
    }

    private applySearch(): void {
        const { value } = this.searchInput.nativeElement;

        // TODO: Substituir pelo mecanismo de autocomplete com chips
        // const tags = chips.chipsData.map(function (chip) {
        //     return chip.tag;
        // });
        //
        // const splitTags = tags.map(function (tag) {
        //     return tag.split(' ');
        // }).flat();

        const splitTags = value.split(' ');

        const filteredProjects = this.projects.reduce(
            (acc, project, i, arr) => {
                const keywords = project.tags.concat(
                    project.titulo.split(' '),
                    project.subtitulo ? project.subtitulo.split(' ') : [],
                );

                const found = splitTags.every(tag =>
                    keywords.some(
                        keyword =>
                            clearStringUtil(keyword).includes(
                                clearStringUtil(tag),
                            )
                            || levenshteinDistance(
                                clearStringUtil(keyword),
                                clearStringUtil(tag),
                            ) <= config.levenshteinFactor,
                    ),
                );

                if (found) {
                    acc.push(project);
                }

                return acc;
            },
            [],
        );

        this.filteredProjects.emit(filteredProjects);
    }
}
