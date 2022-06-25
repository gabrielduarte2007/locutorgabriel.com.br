import { FilterService } from './../../_services/filter.service';
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../_services/projects.service';
import { ProjectType } from '_model/ProjectType';
import { Title } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { Project } from '../../../_model/Project';
import { Unsubscriber } from '../../_decorators/unsubscriber.decorator';
import { PlatformLocation } from '@angular/common';

@Component({
    selector: 'projects-view',
    templateUrl: './projects-view.component.html',
    styleUrls: ['./projects-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class ProjectsViewComponent implements AfterViewInit {
    public visibleShareLink = false;

    public ProjectType = ProjectType;

    @Unsubscriber() subscriptions;

    public get currentProject(): Project {
        return this.service.currentProject.value;
    }

    public getSearchLink(): string {
        const { protocol, hostname, port } = this.platformLocation;

        const formattedPort = port ? ':' + port : '';

        return (
            protocol
            + '//'
            + hostname
            + formattedPort
            + '/'
            +  this.service.getSlug(this.currentProject)
        );
    }

    constructor(
        private readonly platformLocation: PlatformLocation,
        private readonly router: Router,
        public readonly service: ProjectsService,
        private readonly titleService: Title,
        private readonly filterService: FilterService
    ) {
        this.subscriptions = this.service.currentProject.subscribe(
            this.updateTitle.bind(this),
        );
    }

    ngAfterViewInit(): void {

    }

    private updateTitle(): void {
        if (!this.service.currentProject.value) {
            return;
        }

        this.titleService.setTitle(
            `${this.service.currentProject.value.titulo} - ${this.service.currentProject.value.subtitulo}`,
        );
    }

    public shareLink(): void {
        this.visibleShareLink = !this.visibleShareLink;
    }

    public onTooltipClicked(tooltip: MatTooltip): void {
        tooltip.disabled = false;
        tooltip.show();
    }
}
