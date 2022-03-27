import { Component, Input } from '@angular/core';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';
import { ViewportScroller } from '@angular/common';
import { clearStringUtil } from 'app/_utils/clear-string.util';

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

    @Input()
    public canCloseOnClick: boolean = false;

    @Input()
    public canShowClose: boolean;

    constructor(
        private readonly filterService: FilterService,
        private readonly viewportScroller: ViewportScroller,
    ) {}

    public get highlight(): boolean {
        return this.filterService.searchTags
            .map(s => clearStringUtil(s))
            .includes(
                clearStringUtil(this.tag?.text) || clearStringUtil(this.rawTag),
            ) || this.tag?.highlight;
    }

    public deleteTag($event: MouseEvent, tag: string) {
        this.filterService.deleteChipByText(tag);

        $event.stopPropagation();
        $event.preventDefault();
    }

    public onClickTag($event: MouseEvent): void {
        const text = this.tag?.text || this.rawTag;

        if (this.filterService.searchTags.includes(text) && this.canCloseOnClick) this.deleteTag($event, text);
        else this.filterService.addTag(this.tag?.text || this.rawTag);

        this.viewportScroller.scrollToAnchor('cards-filter');

        $event.stopPropagation();
        $event.preventDefault();
    }
}
