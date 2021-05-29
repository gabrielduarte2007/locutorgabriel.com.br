import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchAreaComponent } from './search-area/search-area.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [FooterComponent, HeaderComponent, SearchAreaComponent],
    imports: [CommonModule, MatIconModule],
    exports: [
        CommonModule,
        FooterComponent,
        HeaderComponent,
        SearchAreaComponent,
    ],
})
export class SharedModule {}
