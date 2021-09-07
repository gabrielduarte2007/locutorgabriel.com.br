import { EventEmitter, Injectable } from '@angular/core';
import * as M from 'assets/libs/materialize.min';
import { Project } from '../../_model/Project';

@Injectable({
    providedIn: 'root',
})
export class FilterService {
    // Tags Data

    private allProjectTags: string[] = [];

    // Tags Events

    public tagAdded = new EventEmitter<string>();

    public onChipAddEvent = new EventEmitter<any>();

    // Chips

    private chipInstance: any;

    // Init Methods

    public init(projects: Project[], chipsElement: HTMLDivElement): void {
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
            onChipAdd: (param1, param2) => {
                this.onChipAddEvent.emit({ param1, param2 });
            },
            // onChipDelete: (a, b, c) => {
            //     console.log({ a, b, c });
            // },
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
}
