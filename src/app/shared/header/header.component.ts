import { Component } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.sass'],
})
export class HeaderComponent {
    isMobile: boolean = true;

    copyMessage(val: string){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

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
