import { EventEmitter, Injectable } from '@angular/core';
import * as M from 'assets/libs/materialize.min';
import { Project } from '../../_model/Project';
import { clearStringUtil } from '../_utils/clear-string.util';
import { levenshteinDistance } from '../_utils/levenshtein.distance';
import { config } from '../../_data/config.data';
import { ChipAddEvent } from '../../_model/ChipAddEvent';
import { ChipDeleteEvent } from '../../_model/ChipDeleteEvent';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Unsubscriber } from '../_decorators/unsubscriber.decorator';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    // Tags Data

    private allProjectTags: string[] = [];

    // Tags Events

    public onChipAddEvent = new EventEmitter<ChipAddEvent>();

    public onChipDeleteEvent = new EventEmitter<ChipDeleteEvent>();

    // Chips

    private chipInstance: any;

    // Projects

    public projects: Project[];

    // Projects Events

    public filteredProjects = new EventEmitter<Project[]>();

    public get searchTags(): string[] {
        return (
            this.chipInstance?.chipsData?.map(chipData => chipData.tag) ?? []
        );
    }

    // Service Ready

    public onReady = new EventEmitter();

    @Unsubscriber() subscriptions;

    constructor(private readonly router: Router) {
        this.subscriptions = this.onReady
            .pipe(delay(0))
            .subscribe(this.loadCurrentSearch.bind(this));
    }

    // Init Methods

    public init(projects: Project[], chipsElement: HTMLDivElement): void {
        this.projects = projects;

        // Build Project Tags
        this.buildProjectTags(projects);

        // Convert tags array into an object based on 'chips' data format
        const autocompleteData = this.allProjectTags.reduce((acc, curr) => {
            acc[curr] = null;

            return acc;
        }, {});

        const placeholderDesktop =
            'Busque por cliente, clima, interpretação, tipo da peça, área de atuação, etc';
        const placeholderMobile = 'Cliente, clima, etc';

        const isMobile = window.innerWidth <= 620;

        this.chipInstance = M.Chips.init(chipsElement, {
            placeholder: isMobile ? placeholderMobile : placeholderDesktop,
            autocompleteOptions: {
                data: autocompleteData,
                limit: Infinity,
                minLength: 1,
            },
            onChipAdd: (_, element) => {
                const chips = Array.from(this.chipInstance.$chips);
                const index = chips.indexOf(element);
                const data = this.chipInstance.chipsData[index].tag;

                this.onChipAddEvent.emit({
                    element,
                    data,
                    index,
                });
            },
            onChipDelete: (_, element) => {
                this.onChipDeleteEvent.emit({ element });
            },
        });

        // Subscribe events

        this.onChipAddEvent.subscribe(() => {
            this.applyFilter();
        });

        this.onChipDeleteEvent.subscribe(() => {
            this.applyFilter();
        });

        this.onReady.emit();
    }

    // Build projects tags

    private buildProjectTags(projects: Project[]): void {
        this.allProjectTags = Array.from(
            new Set(
                projects
                    .map(project => [
                        ...project.tags,
                        project.titulo,
                        project.subtitulo,
                        `${project.titulo}: ${project.subtitulo}`,
                    ])
                    .flat(),
            ),
        );
    }

    // Tag Methods

    public addTag(tag: string): void {
        this.chipInstance.addChip({ tag });
    }

    public resetTags() {
        const chips = document.querySelectorAll('.chips-target > .chip');
        chips.forEach(i => i.querySelector('i').click());
    }

    // Chip Methods

    public deleteChip(index: number): void {
        this.chipInstance.deleteChip(index);
    }

    public deleteChipByText(text: string) {
        const chips = document.querySelectorAll('.chips-target > .chip');
        const tag = Array.from(chips).find(
            i => i.children[0].previousSibling.textContent === text,
        );

        tag.querySelector('i').click();
    }

    // Apply Filter

    private applyFilter(): void {
        const filteredProjects = this.projects.reduce(
            (acc, project, i, arr) => {
                const keywords = project.tags.concat(
                    project.titulo.split(' '),
                    project.subtitulo ? project.subtitulo.split(' ') : [],
                    `${project.titulo}: ${project.subtitulo}`,
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

    // Load Current Search

    private loadCurrentSearch(): void {
        if (!this.router.url?.includes('/busca/')) {
            return;
        }

        const currentSearch = this.router.url?.replace('/busca/', '');

        if (!currentSearch) {
            return;
        }

        // Split Tags

        const invertClearUrl = url =>
            decodeURIComponent(url).replace(/_/g, ' ');

        const tags = invertClearUrl(currentSearch).split('&');

        tags.forEach(this.addTag.bind(this));
    }
}
