import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { projects } from '../../../_data/projects.data';
import slugify from 'slugify';
import { Project } from '../../../_model/Project';
import { ProjectsService } from '../../_services/projects.service';
import { config } from '../../../_data/config.data';
import { ProjectType } from '_model/ProjectType';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
    selector: 'projects-view',
    templateUrl: './projects-view.component.html',
    styleUrls: ['./projects-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectsViewComponent implements OnDestroy {
    public currentProject: Project;

    public relatedProjects: Project[] = projects.slice(20, 26);

    public visibleShareLink = false;

    public ProjectType = ProjectType;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private readonly router: Router,
        public readonly service: ProjectsService,
    ) {
        this.loadCurrentProject();

        this.router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                delay(0),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => {
                this.loadCurrentProject();
            });
    }

    private loadCurrentProject(): void {
        const slug = this.router.url?.replace('/', '');

        this.currentProject = projects.find(
            project => slugify(project.id) === slug,
        );

        const relatedProjects: Project[] = this.service.projects.reduce(
            (previousValue, currentValue) => {
                if (currentValue !== this.currentProject) {
                    const tags = currentValue.tags;

                    const numberOfEqualTags = this.currentProject.tags
                        .map(tag => tags.includes(tag))
                        .reduce((a, b) => a + (b ? 1 : 0), 0);

                    if (numberOfEqualTags > 0) {
                        previousValue.push(currentValue);
                    }
                }

                return previousValue;
            },
            [] as Project[],
        );

        this.relatedProjects = relatedProjects.slice(
            0,
            config.maxRelatedProjects,
        );
    }

    public shareLink(): void {
        this.visibleShareLink = !this.visibleShareLink;
    }

    public ngOnDestroy(): void {
        console.log('destroy');

        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
