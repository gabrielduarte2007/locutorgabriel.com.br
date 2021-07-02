import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
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
export class CardsFilterComponent implements OnInit, AfterViewInit {
    // Search config

    public selectable = true;
    public removable = true;
    public separatorKeysCodes: number[] = [ENTER, COMMA];

    // Search elements

    public formControl = new FormControl();
    public filteredProjectTags: Observable<string[]>;
    public searchTags: string[] = [];
    private allProjectTags: string[] = [];

    // Search Input

    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

    // Projects Input/Output

    @Input()
    public projects: Project[] = [];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    ngOnInit(): void {
        this.buildProjectsTags();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.listenSearchInputEvents();
        }, 0);
    }

    // Listen SearchInput events

    private listenSearchInputEvents(): void {
        this.filteredProjectTags = this.formControl.valueChanges.pipe(
            startWith(null),
            map<string, string>(value => clearStringUtil(value)),
            map<string, string[]>(value =>
                value
                    ? this.allProjectTags.filter(projectTag =>
                          clearStringUtil(projectTag).includes(value),
                      )
                    : this.allProjectTags,
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

        if (value) {
            this.searchTags.push(value);
        }

        // Clear the input value
        event.input.value = '';

        this.formControl.setValue(null);

        this.applySearch();
    }

    public remove(projectTag: string): void {
        const index = this.searchTags.indexOf(projectTag);

        if (index >= 0) {
            this.searchTags.splice(index, 1);
        }

        this.applySearch();
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.searchTags.push(event.option.viewValue);
        this.searchInput.nativeElement.value = '';
        this.formControl.setValue(null);

        this.applySearch();
    }

    private applySearch(): void {
        const filteredProjects = this.projects.reduce(
            (acc, project, i, arr) => {
                const keywords = project.tags.concat(
                    project.titulo.split(' '),
                    project.subtitulo ? project.subtitulo.split(' ') : [],
                );

                const found = this.searchTags.every(tag =>
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
