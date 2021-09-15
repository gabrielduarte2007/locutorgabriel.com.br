import { Component, Input } from '@angular/core';
import { FilterService } from '../../../_services/filter.service';
import { ProjectTag } from '../../../../_model/ProjectTag';

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

    constructor(private readonly filterService: FilterService) {}

    public onClickTag($event: MouseEvent): void {
        this.filterService.addTag(this.tag.text);

        $event.stopPropagation();
        $event.preventDefault();
    }
}
