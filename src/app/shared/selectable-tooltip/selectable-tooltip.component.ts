import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
} from '@angular/core';

@Component({
    selector: '[selectableTooltip]',
    templateUrl: './selectable-tooltip.component.html',
    styleUrls: ['./selectable-tooltip.component.sass'],
})
export class SelectableTooltipComponent implements AfterViewInit {
    @Input()
    message: string;
    public show: boolean;

    @ViewChild('element')
    element: ElementRef<HTMLDivElement>;

    constructor(private elementRef: ElementRef) {}

    ngAfterViewInit(): void {
        this.elementRef.nativeElement.ondragstart = () => {
            return false;
        };
    }

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent): void {
        const target = $event.target;

        if (target === this.element.nativeElement) {
            return;
        }

        this.show = !this.show;
    }

    @HostListener('document:click', ['$event'])
    clickOut($event): void {
        if (
            this.show
            && !this.elementRef.nativeElement.contains($event.target)
        ) {
            this.show = false;
        }
    }
}
