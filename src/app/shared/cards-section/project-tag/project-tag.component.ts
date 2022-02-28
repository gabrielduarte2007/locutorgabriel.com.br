import { Component, Input } from '@angular/core';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';
import { ViewportScroller } from '@angular/common';

@Component({
    selector: 'app-project-tag',
    templateUrl: './project-tag.component.html',
    styleUrls: ['./project-tag.component.sass'],
})
export class ProjectTagComponent {
    @Input()
    public tag: ProjectTag;

    @Input()
    public rawTag: string;

    constructor(
        private readonly filterService: FilterService,
        private readonly viewportScroller: ViewportScroller
    ) {}

    public onClickTag($event: MouseEvent): void {
        this.filterService.addTag(this.tag?.text || this.rawTag);
        this.viewportScroller.scrollToAnchor('cards-filter');

        $event.stopPropagation();
        $event.preventDefault();
    }
}
