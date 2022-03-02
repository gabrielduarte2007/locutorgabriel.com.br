import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ChangeDetectorRef,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { Project } from '../../../../_model/Project';
import { ProjectsService } from '../../../_services/projects.service';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';
import { clearStringUtil } from 'app/_utils/clear-string.util';
import * as Isotope from 'assets/libs/isotope.pkgd.min';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements AfterViewInit {
    @Input()
    public projects: Project[];
    public projectList = [];

    public isotopeInstance: any;

    private cdr: ChangeDetectorRef;

    private readonly TAGS_AMOUNT = 3;

    @ViewChild('projectsElement')
    projectsElement: ElementRef<HTMLDivElement>;

    constructor(
        public readonly service: ProjectsService,
        private readonly filterService: FilterService,
        changeDetectorRef: ChangeDetectorRef
    ) {
        this.cdr = changeDetectorRef;
    }

    ngAfterViewInit(): void {
        this.initIsotope();

        const { searchTags, backupList } = this.filterService
        if (searchTags.length) this.filterProjects(backupList);
        this.cdr.detectChanges();
    }

    private initIsotope(): void {
        const elem = this.projectsElement.nativeElement;

        this.isotopeInstance = new Isotope(elem, {
            itemSelector: '.card',
        });
    }

    public filterProjects(filteredProjects: Project[]): void {
        this.filterService.backupList = filteredProjects;

        this.isotopeInstance.arrange({
            filter: itemElem => {
                const index = itemElem.getAttribute('data-index');
                const project = this.projects[index];

                return filteredProjects.indexOf(project) >= 0;
            },
        });
    }

    public listMaker(): Project[] {
        const findCommonElements = (arr1: string[], arr2: string[]) => arr1.some(item => arr2.includes(item))
        const normalize = (str: string) => clearStringUtil(str)
        if (!this.filterService.searchTags.length) return this.projects;
        return this.projects.filter(i =>
            findCommonElements(i.tags, this.filterService.searchTags) ||
            findCommonElements(i.tags.map(t => normalize(t).split(' ')).flat(), this.filterService.searchTags.map(normalize)) ||
            findCommonElements(i.tags.map(t => normalize(t)), this.filterService.searchTags.map(normalize))
        );
    }

    public getTagList(project: Project): ProjectTag[] {
        const searchTags = this.filterService.searchTags.map(st => clearStringUtil(st));

        const firstTags = project.tags
            .filter(tag => !searchTags.includes(clearStringUtil(tag)))
            .slice(0, this.TAGS_AMOUNT);

        const highlightTags = project.tags.filter(tag =>
            searchTags.includes(clearStringUtil(tag)) || [...clearStringUtil(tag).split(' ')].some(t => searchTags.includes(t)),
            // searchTags.map(t => clearStringUtil(t)).includes(clearStringUtil(tag)),
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
