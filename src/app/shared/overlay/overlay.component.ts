import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-overlay',
    templateUrl: './overlay.component.html',
    styleUrls: ['./overlay.component.sass'],
})
export class OverlayComponent {
  @Output() onClick: EventEmitter<null> = new EventEmitter();

  private target: HTMLElement = document.body;
  private container: HTMLElement;

  ngOnInit() {
    this.container = this.target;
    const overlay = document.querySelector('.overlay')
    this.container.append(overlay);
  }

  ngOnDestroy() {
    const overlay = document.querySelector('.overlay')
    this.container.removeChild(overlay);
  }

  public output() {
      this.onClick.emit();
  }
}
