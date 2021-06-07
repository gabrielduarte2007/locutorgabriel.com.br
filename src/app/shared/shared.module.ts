import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsFilterComponent } from './cards-section/cards-filter/cards-filter.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { CardsSectionComponent } from './cards-section/cards-section.component';
import { CardsListComponent } from './cards-section/cards-list/cards-list.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        // Structure
        FooterComponent,
        HeaderComponent,

        // Cards
        CardsSectionComponent,
        CardsFilterComponent,
        CardsListComponent,
    ],
    imports: [CommonModule, MatIconModule, RouterModule],
    exports: [
        CommonModule,

        // Structure
        FooterComponent,
        HeaderComponent,

        // Cards
        CardsSectionComponent,
        CardsFilterComponent,
        CardsListComponent,
    ],
})
export class SharedModule {}
