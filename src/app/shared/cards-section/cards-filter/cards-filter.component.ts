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
