import { Component, ViewEncapsulation } from '@angular/core';
import { projects } from '../../../_data/projects.data';

@Component({
    selector: 'home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeViewComponent {
    public projects = projects;
}
