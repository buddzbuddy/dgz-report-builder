import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, scan } from 'rxjs/operators';

import { latLng, tileLayer } from 'leaflet';
@Component({
  selector: 'app-leaflet-events',
  templateUrl: './leaflet-events.component.html'
})
export class LeafletEventsComponent {

  eventCount = 0;
	eventLog: string = '';

	options = {
		zoom: 12,
		center: latLng([ 42.865563917814136, 74.63687839992807 ])
	};
	baselayer = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' });

	eventSubject = new Subject<string>();

	constructor() {
		this.eventSubject.pipe(
				scan((acc: string, v: string) => `${++this.eventCount}: ${v}\n${acc}`, ''),
				debounceTime(50)
			)
			.subscribe((v: string) => { this.eventLog = v; } );
	}

	handleEvent(eventType: string) {
		this.eventSubject.next(eventType);
	}
}
