import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../_services/projects.service';
import { ProjectType } from '_model/ProjectType';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'projects-view',
    templateUrl: './projects-view.component.html',
    styleUrls: ['./projects-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectsViewComponent implements OnDestroy {
    public visibleShareLink = false;

    public ProjectType = ProjectType;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private readonly router: Router,
        public readonly service: ProjectsService,
        private readonly titleService: Title,
    ) {
        console.log('Construct Component');

        this.updateTitle();
    }

    private updateTitle(): void {
        console.log(this.service.currentProject);

        // const slug = this.router.url?.replace('/', '');
        //
        // this.currentProject = projects.find(
        //     project => this.service.getSlug(project) === slug,
        // );

        // this.currentProject = this.service.loadCurrentProject;

        this.titleService.setTitle(
            `${this.service.currentProject.titulo} - ${this.service.currentProject.subtitulo}`,
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
