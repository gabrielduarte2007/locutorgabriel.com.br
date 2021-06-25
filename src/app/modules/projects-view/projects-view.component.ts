import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { projects } from '../../../_data/projects.data';
import slugify from 'slugify';
import { Project } from '../../../_model/Project';
import { ProjectsService } from '../../_services/ProjectsService';

@Component({
    selector: 'projects-view',
    templateUrl: './projects-view.component.html',
    styleUrls: ['./projects-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectsViewComponent {
    currentProject: Project;

    relatedProjects: Project[] = projects.slice(20, 26);

    visibleShareLink: boolean = false;

    constructor(
        private readonly router: Router,
        public readonly service: ProjectsService,
    ) {
        const slug = this.router.url?.replace('/', '');

        this.currentProject = projects.find(
            project => slugify(project.id) === slug,
        );
    }

    shareLink(): void {
        this.visibleShareLink = !this.visibleShareLink;
    }
}
