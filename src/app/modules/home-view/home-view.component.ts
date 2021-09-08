import {
    AfterViewInit,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { projects } from '../../../_data/projects.data';

@Component({
    selector: 'home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.sass'],
    encapsulation: ViewEncapsulation.None,
})
export class HomeViewComponent implements AfterViewInit {
    public projects = projects;

    @ViewChild('polylineStart')
    polylineStart: ElementRef<HTMLImageElement>;

    @ViewChild('polylineEnd')
    polylineEnd: ElementRef<HTMLDivElement>;

    @ViewChild('polyline')
    polyline: ElementRef<SVGPolylineElement>;

    @ViewChild('circle')
    circle: ElementRef<SVGCircleElement>;

    ngAfterViewInit(): void {}

    addPolyline(): void {
        const circle = this.circle.nativeElement;
        const polyline = this.polyline.nativeElement;
        const svg = polyline.ownerSVGElement;

        polyline.points.clear();

        // Get Start Position
        const polylineStart = this.polylineStart.nativeElement;

        const xStart = polylineStart.offsetLeft + polylineStart.width - 40;
        const yStart = polylineStart.offsetTop + polylineStart.height / 2;

        // Add Circle at Start Position
        circle.setAttributeNS(null, 'cx', xStart.toString());
        circle.setAttributeNS(null, 'cy', yStart.toString());

        // Add Point at Start Position
        const pointStart: SVGPoint = svg.createSVGPoint();
        pointStart.x = xStart;
        pointStart.y = yStart;
        polyline.points.appendItem(pointStart);

        // Get End Position
        const polylineEnd = this.polylineEnd.nativeElement;

        const xEnd = polylineEnd.offsetLeft;
        const yEnd = polylineEnd.offsetTop + polylineEnd.clientHeight + 1;

        // Add Point at End Position
        const pointEnd: SVGPoint = svg.createSVGPoint();
        pointEnd.x = xEnd;
        pointEnd.y = yEnd;
        polyline.points.appendItem(pointEnd);
    }

    onResize(): void {
        this.addPolyline();
    }
}
