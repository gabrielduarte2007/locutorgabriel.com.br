import { Component } from '@angular/core';
import { FilterService } from 'app/_services/filter.service';
import { isMobileUtil } from '../../_utils/is-mobile.util';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
    isMobile: boolean = true;

    constructor(
        public readonly filterService: FilterService,
    ) {}

    toggleIcon(): void {
        this.isMobile = !this.isMobile;
    }

    resetTags() {
        this.filterService.resetTags()
    }

    public onPhoneClicked($event: MouseEvent): void {
        if (!isMobileUtil()) {
            $event.preventDefault();
        }
    }
}
