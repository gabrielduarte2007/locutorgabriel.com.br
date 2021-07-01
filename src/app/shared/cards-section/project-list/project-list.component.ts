import { Component, Input } from '@angular/core';
import { Project } from '../../../../_model/Project';
import { ProjectsService } from '../../../_services/ProjectsService';

@Component({
    selector: 'app-project-list',
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.sass'],
})
export class ProjectListComponent {
    @Input()
    public projects: Project[];

    constructor(public readonly service: ProjectsService) {}

    public updateList(projects: Project[]): void {
        this.projects = projects;
    }
}
