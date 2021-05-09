import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectsViewComponent } from './projects-view.component';
import { RouterModule } from '@angular/router';
import { projectsViewRoutes } from './projects-view.routing';

@NgModule({
    declarations: [ProjectsViewComponent],
    imports: [
        // Angular
        CommonModule,
        RouterModule.forChild(projectsViewRoutes),

        // Material
        MatButtonModule,
        MatIconModule,

        // Shared
        SharedModule,
    ],
})
export class ProjectsViewModule {}
