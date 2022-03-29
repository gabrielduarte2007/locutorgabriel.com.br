import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
import { Router } from '@angular/router';

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

    public selectable = true;
    public removable = true;
    public visibleShareLink = false;
    public canShare = false;

    // Projects Input/Output

    @Input()
    public projects: Project[] = [];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    constructor(
        public filterService: FilterService,
        private readonly platformLocation: PlatformLocation,
        private readonly viewportScroller: ViewportScroller,
        private router: Router,
        private cdr: ChangeDetectorRef,
    ) {}

    ngAfterViewInit(): void {
        this.filterService.init(this.projects, this.chips.nativeElement);

        this.filterService.onChipAddEvent.subscribe(chipAddEvent => {
            this.onChipAdd(chipAddEvent);

            this.scrollToCardsFilter();
            this.verifyIfCanShare();
        });

        this.filterService.filteredProjects.subscribe(this.filteredProjects);
        this.initChips();
        this.verifyIfCanShare();
    }

    public verifyIfCanShare(): void {
        this.canShare = Boolean(this.filterService.searchTags.length);
        this.cdr.detectChanges();
    }

    private initChips() {
        if (this.filterService.getChipInstance.chipsData.length) {
            this.filterService.searchTags.forEach((data, index) => {
                const element =
                    this.filterService.getChipInstance.$chips[index];
                this.onChipAdd({ data, index, element });
            });
        }
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
        const { url } = this.router;

        if (url.includes('busca'))
            (document.querySelector('#cards-filter') as HTMLAnchorElement).scrollIntoView()
    }
}
