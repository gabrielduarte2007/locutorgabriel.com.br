import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { Project } from '../../../../_model/Project';
import { ProjectsService } from '../../../_services/projects.service';
import * as Isotope from 'assets/libs/isotope.pkgd.min';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements AfterViewInit {
    @Input()
    public projects: Project[];

    @ViewChild('projectsElement')
    projectsElement: ElementRef<HTMLDivElement>;

    public isotopeInstance: any;

    private readonly TAGS_AMOUNT = 3;

    constructor(
        public readonly service: ProjectsService,
        private readonly filterService: FilterService,
    ) {}

    ngAfterViewInit(): void {
        this.initIsotope();

        window.onresize = this.initIsotope;
    }

    private initIsotope(): void {
        const elem = this.projectsElement.nativeElement;

        this.isotopeInstance = new Isotope(elem, {
            itemSelector: '.card',
        });
    }

    public filterProjects(filteredProjects: Project[]): void {
        this.isotopeInstance.arrange({
            filter: itemElem => {
                const index = itemElem.getAttribute('data-index');
                const project = this.projects[index];

                return filteredProjects.indexOf(project) >= 0;
            },
        });
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
