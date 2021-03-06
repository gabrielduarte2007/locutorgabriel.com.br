import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'app/shared/shared.module';
import { HomeViewComponent } from 'app/modules/home-view/home-view.component';
import { RouterModule } from '@angular/router';
import { homeViewRoutes } from './home-view.routing';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [HomeViewComponent],
    imports: [
        // Angular
        CommonModule,
        RouterModule.forChild(homeViewRoutes),

        // Material
        MatButtonModule,
        MatFormFieldModule,

        // Shared
        SharedModule,
    ],
})
export class HomeViewModule {}
