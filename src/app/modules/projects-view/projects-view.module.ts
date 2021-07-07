import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectsViewComponent } from './projects-view.component';
import { RouterModule } from '@angular/router';
import { projectsViewRoutes } from './projects-view.routing';
import { SafePipe } from '../_pipes/safe.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        // Components
        ProjectsViewComponent,

        // Pipes
        SafePipe,
    ],
    imports: [
        // Angular
        CommonModule,
        RouterModule.forChild(projectsViewRoutes),

        // Material
        MatButtonModule,
        MatIconModule,

        // Shared
        SharedModule,
        ClipboardModule,
        FormsModule,
        MatTooltipModule,
    ],
})
export class ProjectsViewModule {}
