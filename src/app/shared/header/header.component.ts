import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
    isMobile: boolean = true;

    // tslint:disable-next-line:typedef use-lifecycle-interface
    ngOnInit() {
        if (window.screen.width === 360) {
            this.isMobile = true;
        }
    }

    // tslint:disable-next-line:typedef
    toggleIcon() {
        this.isMobile = !this.isMobile;
    }
}
