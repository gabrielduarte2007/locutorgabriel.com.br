import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsFilterComponent } from './cards-section/cards-filter/cards-filter.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { CardsSectionComponent } from './cards-section/cards-section.component';
import { ProjectListComponent } from './cards-section/project-list/project-list.component';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../_services/projects.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        // Structure
        FooterComponent,
        HeaderComponent,

        // Cards
        CardsSectionComponent,
        CardsFilterComponent,
        ProjectListComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,

        // Forms
        ReactiveFormsModule,

        // Angular Material
        MatIconModule,
        MatMenuModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTooltipModule,
        MatInputModule,
        MatButtonModule,
    ],
    exports: [
        CommonModule,

        // Structure
        FooterComponent,
        HeaderComponent,

        // Cards
        CardsSectionComponent,
        CardsFilterComponent,

        // Project
        ProjectListComponent,
    ],
    providers: [ProjectsService],
})
export class SharedModule {}
