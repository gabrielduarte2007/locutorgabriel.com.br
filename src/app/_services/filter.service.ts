import { EventEmitter, Injectable } from '@angular/core';
import * as M from 'assets/libs/materialize.min';
import { Project } from '../../_model/Project';
import { clearStringUtil } from '../_utils/clear-string.util';
import { levenshteinDistance } from '../_utils/levenshtein.distance';
import { config } from '../../_data/config.data';
import { ChipAddEvent } from '../../_model/ChipAddEvent';
import { ChipDeleteEvent } from '../../_model/ChipDeleteEvent';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    // Tags Data

    private allProjectTags: string[] = [];

    private searchTags: string[] = [];

    // Tags Events

    public onChipAddEvent = new EventEmitter<ChipAddEvent>();

    public onChipDeleteEvent = new EventEmitter<ChipDeleteEvent>();

    // Chips

    private chipInstance: any;

    // Projects

    public projects: Project[];

    // Projects Events

    public filteredProjects = new EventEmitter<Project[]>();

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

        this.chipInstance = M.Chips.init(chipsElement, {
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
                        project.titulo + ': ' + project.subtitulo,
                    ])
                    .flat(),
            ),
        );
    }

    // Tag Methods

    public addTag(tag: string): void {
        this.chipInstance.addChip({ tag });
    }

    // Chip Methods

    public deleteChip(index: number): void {
        this.chipInstance.deleteChip(index);
    }

    // Apply Filter

    private applyFilter(): void {
        const filteredProjects = this.projects.reduce(
            (acc, project, i, arr) => {
                const keywords = project.tags.concat(
                    project.titulo.split(' '),
                    project.subtitulo ? project.subtitulo.split(' ') : [],
                );

                const searchTags = this.chipInstance.chipsData.map(
                    chipData => chipData.tag,
                );

                const found = searchTags.every(tag =>
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
