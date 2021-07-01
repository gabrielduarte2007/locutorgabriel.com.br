import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Project } from '../../../../_model/Project';

// TODO: Separar em arquivos individuais
const levenshteinFactor = 1;

const clearString = tag => clearAccent(tag.toLowerCase());

const clearAccent = tag => tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// TODO: Fim do TODO

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

    @ViewChild('searchInput')
    public searchInput: ElementRef<HTMLInputElement>;

    ngAfterViewInit(): void {
        this.searchInput.nativeElement.onchange = () => this.applySearch();
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
                            clearString(keyword).includes(clearString(tag))
                            || levenshteinDistance(
                                clearString(keyword),
                                clearString(tag),
                            ) <= levenshteinFactor,
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

// TODO: Separar em um arquivo de util
// Compute the edit distance between the two given strings
const levenshteinDistance = (a: string, b: string) => {
    if (a.length === 0) {
        return b.length;
    }

    if (b.length === 0) {
        return a.length;
    }

    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1,
                    ),
                ); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
};
