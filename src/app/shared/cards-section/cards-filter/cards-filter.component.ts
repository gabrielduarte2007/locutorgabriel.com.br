import {
    AfterViewInit,
    ChangeDetectionStrategy,
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
import { PlatformLocation, ViewportScroller } from '@angular/common';
import { clearAccentUtil } from '../../../_utils/clear-accent.util';

@Component({
    selector: 'app-cards-filter',
    templateUrl: './cards-filter.component.html',
    styleUrls: ['./cards-filter.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsFilterComponent implements AfterViewInit {
    @ViewChild('chips')
    chips: ElementRef<HTMLDivElement>;

    @ViewChild('chipsTarget')
    chipsTarget: ElementRef<HTMLDivElement>;

    // Search config

    countTags = 0;
    public selectable = true;
    public removable = true;
    public visibleShareLink = false;

    // Projects Input/Output

    @Input()
    public projects: Project[] = [];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    constructor(
        public readonly filterService: FilterService,
        private readonly platformLocation: PlatformLocation,
        private readonly viewportScroller: ViewportScroller,
    ) {}

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
        chipElementClone.removeChild(closeButton);
        chipElementClone.classList.value = 'chip chip-style';
        chipElementClone.onclick = () => {
            const chipTargetElements = Array.from(
                this.chipsTarget.nativeElement.children,
            );
            this.countTags--;
            const index = chipTargetElements.indexOf(chipElementClone);
            this.filterService.deleteChip(index);
            chipElementClone.remove();
        };

        // chipElementClone.classList.value = ' chip chip--selection tag text-sm p-2 w-auto rounded-md border-solid border-2 border-yellow-500 m-1'

        this.chipsTarget.nativeElement.appendChild(chipElementClone);
        this.countTags++;
    }

    public shareLink(): void {
        this.visibleShareLink = !this.visibleShareLink;
    }

    public getSearchLink(): string {
        const { protocol, hostname, port } = this.platformLocation;

        const formattedPort = port ? ':' + port : '';

        return (
            protocol
            + '//'
            + hostname
            + formattedPort
            + '/'
            + 'busca/'
            + clearAccentUtil(
                this.filterService.searchTags.join('&').replace(' ', '_'),
            )
        );
    }

    private scrollToCardsFilter(): void {
        this.viewportScroller.scrollToAnchor('cards-filter');
    }
}
