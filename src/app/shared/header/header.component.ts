import { FilterService } from './../../_services/filter.service';
import { Component } from '@angular/core';
import { isMobileUtil } from '../../_utils/is-mobile.util';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {

    constructor(
        private filterService: FilterService,
    ) {}

    isMobile: boolean = true;

    toggleIcon(): void {
        this.isMobile = !this.isMobile;
    }

    public onPhoneClicked($event: MouseEvent): void {
        if (!isMobileUtil()) {
            $event.preventDefault();
        }
    }

    public resetTags() {
        this.filterService.resetTags();
    }
}
