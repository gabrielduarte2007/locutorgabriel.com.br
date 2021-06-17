import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { projects } from '../../../_data/projects.data';
import slugify from 'slugify';
import { Project } from '../../../_model/Project';

@Component({
    selector: 'projects-view',
    templateUrl: './projects-view.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ProjectsViewComponent {
    currentProject: Project;

    constructor(private readonly router: Router) {
        const slug = this.router.url?.replace('/', '');

        this.currentProject = projects.find(
            project => slugify(project.id) === slug,
        );
    }
}
