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
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-cards-filter',
    templateUrl: './cards-filter.component.html',
    styleUrls: ['./cards-filter.component.sass'],
})
export class CardsFilterComponent implements AfterViewInit {
    // Search config

    public selectable = true;
    public removable = true;
    public separatorKeysCodes: number[] = [ENTER, COMMA];

    // Search elements

    public formControl = new FormControl();
    public filteredProjectTags: Observable<string[]>;
    public projectTags: string[] = [];
    private allProjectTags: string[] = [];

    // Search Input

    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

    // Projects Input/Output

    @Input()
    public projects: Project[] = [];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    constructor() {
        this.listenSearchInputEvents();
    }

    ngAfterViewInit(): void {
        this.buildProjectsTags();
    }

    // Listen SearchInput events

    private listenSearchInputEvents(): void {
        this.filteredProjectTags = this.formControl.valueChanges.pipe(
            map<string, string>(value => clearStringUtil(value)),
            map<string, string[]>(value =>
                this.allProjectTags.filter(projectTag =>
                    clearStringUtil(projectTag).includes(value),
                ),
            ),
        );
    }

    // Build projects tags

    private buildProjectsTags(): void {
        this.allProjectTags = Array.from(
            new Set(
                this.projects
                    .map(project => [
                        ...project.tags,
                        project.titulo,
                        project.subtitulo,
                        project.titulo + ': ' + project.subtitulo,
                    ])
                    .flat(),
            ),
        );
    }

    // Chips events (add, remove, selected)

    public add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our element
        if (value) {
            this.projectTags.push(value);
        }

        // Clear the input value
        event.input.value = '';

        this.formControl.setValue(null);
    }

    public remove(projectTag: string): void {
        const index = this.projectTags.indexOf(projectTag);

        if (index >= 0) {
            this.projectTags.splice(index, 1);
        }
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.projectTags.push(event.option.viewValue);
        this.searchInput.nativeElement.value = '';
        this.formControl.setValue(null);
    }

    // TODO: Conectar com Material Chips
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
