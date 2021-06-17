import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-cards-section',
    templateUrl: './cards-section.component.html',
    styleUrls: ['./cards-section.component.sass'],
})
export class CardsSectionComponent {
    @Input()
    public sectionTitle: string;

    @Input()
    public sectionSubtitle?: string;
}
