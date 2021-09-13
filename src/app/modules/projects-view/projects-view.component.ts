import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '../../_services/projects.service';
import { ProjectType } from '_model/ProjectType';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';

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
        this.updateTitle();
    }

    private updateTitle(): void {
        this.titleService.setTitle(
            `${this.service.currentProject.titulo} - ${this.service.currentProject.subtitulo}`,
        );
    }

    public shareLink(): void {
        this.visibleShareLink = !this.visibleShareLink;
    }

    public ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    public onTooltipClicked(tooltip: MatTooltip): void {
        tooltip.disabled = false;
        tooltip.show();
    }
}
