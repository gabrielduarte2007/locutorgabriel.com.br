import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { Project } from '../../../../_model/Project';
import { FilterService } from '../../../_services/filter.service';
import { ChipAddEvent } from '../../../../_model/ChipAddEvent';

@Component({
    selector: 'app-cards-filter',
    templateUrl: './cards-filter.component.html',
    styleUrls: ['./cards-filter.component.sass'],
})
export class CardsFilterComponent implements AfterViewInit {
    @ViewChild('chips')
    chips: ElementRef<HTMLDivElement>;

    @ViewChild('chipsTarget')
    chipsTarget: ElementRef<HTMLDivElement>;

    // Search config

    public selectable = true;
    public removable = true;

    // Projects Input/Output

    @Input()
    public projects: Project[] = [];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    constructor(public readonly filterService: FilterService) {}

    ngAfterViewInit(): void {
        this.filterService.init(this.projects, this.chips.nativeElement);

        this.filterService.onChipAddEvent.subscribe(chipAddEvent => {
            this.onChipAdd(chipAddEvent);
        });

        this.filterService.filteredProjects.subscribe(this.filteredProjects);
    }

    private onChipAdd(chipEvent: ChipAddEvent): void {
        const chipElementClone = chipEvent.element.cloneNode(
            true,
        ) as HTMLDivElement;

        const closeButton = chipElementClone.querySelector(
            '.close',
        ) as HTMLElement;

        closeButton.onclick = () => {
            const chipTargetElements = Array.from(
                this.chipsTarget.nativeElement.children,
            );

            const index = chipTargetElements.indexOf(chipElementClone);

            this.filterService.deleteChip(index);
        };

        this.chipsTarget.nativeElement.appendChild(chipElementClone);
    }
}
