import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
} from '@angular/core';
import { Project } from '../../../../_model/Project';
import { ProjectsService } from '../../../_services/projects.service';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnChanges{
    @Input()
    public projects: Project[];
    public projectList = [];

    public isotopeInstance: any;

    private readonly TAGS_AMOUNT = 3;
    public cdRef: ChangeDetectorRef;

    constructor(
        public readonly service: ProjectsService,
        private readonly filterService: FilterService,
        cdRef: ChangeDetectorRef,
    ) {
        this.cdRef = cdRef;
        this.filterService.onChipDeleteEvent.subscribe(() => this.setProjectList());
        this.filterService.onChipAddEvent.subscribe(() => this.setProjectList());
    }

    ngOnChanges(): void {
        this.setProjectList();
    }

    private setProjectList() {
        this.projectList = this.listMaker();
        this.cdRef.detectChanges();
    }

    public listMaker() {
        const findCommonElements = (arr1: string[], arr2: string[]) => arr1.some(item => arr2.includes(item))
        if (!this.filterService.searchTags.length) return this.projects;
        return this.projects.filter(i => findCommonElements(i.tags, this.filterService.searchTags));
    }

    public getTagList(project: Project): ProjectTag[] {
        const searchTags = this.filterService.searchTags;

        const firstTags = project.tags
            .filter(tag => !searchTags.includes(tag))
            .slice(0, this.TAGS_AMOUNT);

        const highlightTags = project.tags.filter(tag =>
            searchTags.includes(tag),
        );

        const tagList: ProjectTag[] = [];

        for (let i = 0; i < this.TAGS_AMOUNT; i++) {
            if (highlightTags.length) {
                const text = highlightTags.splice(
                    highlightTags.length - 1,
                    1,
                )[0];

                const tag: ProjectTag = {
                    text,
                    highlight: true,
                };

                tagList.push(tag);
            } else {
                const text = firstTags.splice(0, 1)[0];

                const tag: ProjectTag = {
                    text,
                    highlight: false,
                };

                tagList.push(tag);
            }
        }

        return tagList;
    }
}
