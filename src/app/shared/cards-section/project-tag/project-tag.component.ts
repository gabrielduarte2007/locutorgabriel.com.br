import { Component, Input } from '@angular/core';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';
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

    constructor(private readonly filterService: FilterService) {}

    public onClickTag($event: MouseEvent): void {
        const text = this.tag?.text || this.rawTag;

        (document.querySelector('#cards-filter') as HTMLAnchorElement).scrollIntoView()

        const validation = this.filterService.searchTags.includes(text) && this.canCloseOnClick;

        if (validation) this.deleteTag($event, text);
        else setTimeout(() => this.filterService.addTag(this.tag?.text || this.rawTag), 400)

        $event.stopPropagation();
        $event.preventDefault();
    }

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
}
