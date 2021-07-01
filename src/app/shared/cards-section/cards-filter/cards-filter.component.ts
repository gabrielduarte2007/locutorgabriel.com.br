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

@Component({
    selector: 'app-cards-filter',
    templateUrl: './cards-filter.component.html',
    styleUrls: ['./cards-filter.component.sass'],
})
export class CardsFilterComponent implements AfterViewInit {
    @Input()
    public projects: Project[];

    @Output()
    public filteredProjects = new EventEmitter<Project[]>();

    @ViewChild('searchInput')
    public searchInput: ElementRef<HTMLInputElement>;

    ngAfterViewInit(): void {
        this.searchInput.nativeElement.onchange = () => this.applySearch();
    }

    private applySearch(): void {
        const { value } = this.searchInput.nativeElement;

        console.log({ value });
        console.log({ projects: this.projects });

        this.filteredProjects.emit(this.projects);
    }
}
