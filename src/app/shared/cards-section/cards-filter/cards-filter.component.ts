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
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
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
    public separatorKeysCodes: number[] = [ENTER, COMMA];

    // Search elements

    public formControl = new FormControl();
    public filteredProjectTags: Observable<string[]>;
    // public searchTags: string[] = [];

    // Search Input

    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

    // Projects Input/Output

    @Input()
    public projects: Project[] = [];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    constructor(public readonly filterService: FilterService) {}

    //////////////////

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
            this.filterService.deleteChip(chipEvent.index);
        };

        this.chipsTarget.nativeElement.appendChild(chipElementClone);
    }

    //////////////////

    // Listen SearchInput events

    // private listenSearchInputEvents(): void {
    //     this.filteredProjectTags = this.formControl.valueChanges.pipe(
    //         startWith(null),
    //         map<string, string>(value => clearStringUtil(value)),
    //         map<string, string[]>(value =>
    //             value
    //                 ? this.allProjectTags.filter(projectTag =>
    //                       clearStringUtil(projectTag).includes(value),
    //                   )
    //                 : this.allProjectTags,
    //         ),
    //     );
    // }

    // Chips events (add, remove, selected)

    // public add(event: MatChipInputEvent): void {
    //     const value = (event.value || '').trim();
    //
    //     if (value) {
    //         this.searchTags.push(value);
    //     }
    //
    //     // Clear the input value
    //     event.input.value = '';
    //
    //     this.formControl.setValue(null);
    //
    //     this.applySearch();
    // }
    //
    // public remove(projectTag: string): void {
    //     const index = this.searchTags.indexOf(projectTag);
    //
    //     if (index >= 0) {
    //         this.searchTags.splice(index, 1);
    //     }
    //
    //     this.applySearch();
    // }
    //
    // public selected(event: MatAutocompleteSelectedEvent): void {
    //     this.searchTags.push(event.option.viewValue);
    //     this.searchInput.nativeElement.value = '';
    //     this.formControl.setValue(null);
    //
    //     this.applySearch();
    // }
}
