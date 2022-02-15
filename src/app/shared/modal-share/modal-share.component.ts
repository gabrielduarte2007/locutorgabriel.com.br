import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-modal-share',
    templateUrl: './modal-share.component.html',
    styleUrls: ['./modal-share.component.sass'],
})
export class ModalShareComponent {
    @Input() link: string;
    @Output() onClose: EventEmitter<null> = new EventEmitter();

    public showTooltip = false;

    public output() {
        this.onClose.emit();
    }

    public stopPropagation(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    public onTooltipClicked(): void {
        this.showTooltip = true;
    }

    public openShare(link: string) {
        window.open(link);
    }
}
