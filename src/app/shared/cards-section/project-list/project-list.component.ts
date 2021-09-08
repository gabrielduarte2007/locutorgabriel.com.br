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
import { FilterService } from '../../../_services/filter.service';
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

    @ViewChild('projectsElement')
    projectsElement: ElementRef<HTMLDivElement>;

    public isotopeInstance: any;

    constructor(
        public readonly service: ProjectsService,
        public readonly filterService: FilterService,
    ) {}

    public filterProjects(filteredProjects: Project[]): void {
        this.isotopeInstance.arrange({
            filter: itemElem => {
                const index = itemElem.getAttribute('data-index');
                const project = this.projects[index];

                return filteredProjects.indexOf(project) >= 0;
            },
        });
    }

    public getTagList(project: Project): string[] {
        return project.tags.slice(0, 2);
    }

    public onClickTag($event: MouseEvent, tag: string): void {
        this.filterService.addTag(tag);

        $event.stopPropagation();
        $event.preventDefault();
    }

    ngAfterViewInit(): void {
        const elem = this.projectsElement.nativeElement;
        this.isotopeInstance = new Isotope(elem, {
            itemSelector: '.card',
        });
    }
}
