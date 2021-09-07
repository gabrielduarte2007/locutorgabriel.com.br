import { Component, Input } from '@angular/core';
import { Project } from '../../../../_model/Project';
import { ProjectsService } from '../../../_services/projects.service';
import { FilterService } from '../../../_services/filter.service';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.sass'],
})
export class ProjectListComponent {
    @Input()
    public projects: Project[];

    constructor(
        public readonly service: ProjectsService,
        public readonly filterService: FilterService,
    ) {}

    public updateList(projects: Project[]): void {
        this.projects = projects;
    }

    public getTagList(project: Project): string[] {
        return project.tags.slice(0, 2);
    }

    public onClickTag($event: MouseEvent, tag: string): void {
        this.filterService.addTag(tag);

        $event.stopPropagation();
        $event.preventDefault();
    }
}
