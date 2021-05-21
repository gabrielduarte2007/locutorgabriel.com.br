import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'app/shared/shared.module';
import { HomeViewComponent } from 'app/modules/home-view/home-view.component';
import { RouterModule } from '@angular/router';
import { homeViewRoutes } from './home-view.routing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { CardsAreaComponent } from './cards-area/cards-area.component';
import { SearchAreaComponent } from './search-area/search-area.component';

@NgModule({
    declarations: [HomeViewComponent, FooterComponent, HeaderComponent, CardsAreaComponent, SearchAreaComponent],
    imports: [
        // Angular
        CommonModule,
        RouterModule.forChild(homeViewRoutes),

        // Material
        MatButtonModule,

        // Shared
        SharedModule,
        MatFormFieldModule,
        MatIconModule,
    ],
})
export class HomeViewModule {}
