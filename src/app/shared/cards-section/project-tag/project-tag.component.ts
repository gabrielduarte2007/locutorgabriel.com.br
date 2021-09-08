import { Component, Input } from '@angular/core';
import { FilterService } from '../../../_services/filter.service';

@Component({
    selector: 'app-project-tag',
    templateUrl: './project-tag.component.html',
    styleUrls: ['./project-tag.component.sass'],
})
export class ProjectTagComponent {
    @Input()
    public tag: string;

    constructor(private readonly filterService: FilterService) {}

    public onClickTag($event: MouseEvent, tag: string): void {
        this.filterService.addTag(tag);

        $event.stopPropagation();
        $event.preventDefault();
    }
}
