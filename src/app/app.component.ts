import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _router: Router) {
        // Listen for NavigationEnd event to focus on anchors based on URL's hash
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                delay(0),
                filter(event => event instanceof NavigationEnd),
            )
            .subscribe(() => {
                const url = new URL(window.location.href);
                const hash = url.hash?.replace('#', '');

                if (hash) {
                    const anchor = document.getElementById(hash);

                    if (anchor) {
                        anchor.scrollIntoView();
                    }
                }
            });
    }
}
