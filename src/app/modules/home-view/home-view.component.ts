import { Component, ViewEncapsulation } from '@angular/core';
import { FilterService } from 'app/_services/filter.service';
import { ProjectsService } from 'app/_services/projects.service';
// import { projects } from '../../../_data/projects.data';

@Component({
    selector: 'home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeViewComponent {
    constructor(
        public readonly service: ProjectsService,
        public readonly filterService: FilterService,
    ) {}

    public insertTag(tag: string) {
        this.filterService.resetTags();
        this.filterService.addTag(tag);
    }
}
