import { Component, ChangeDetectionStrategy } from '@angular/core';
import { icon, Layer, marker } from 'leaflet';
@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceComponent {
  markers: Layer[] = [];

	mutableAdd() {
		const newMarker = marker(
			[ 46.879966 + 0.1 * (Math.random() - 0.5), -121.726909 + 0.1 * (Math.random() - 0.5) ],
			{
				icon: icon({
					iconSize: [ 25, 41 ],
					iconAnchor: [ 13, 41 ],
					iconUrl: 'leaflet/marker-icon.png',
          shadowUrl: 'leaflet/marker-shadow.png'
				})
			}
		);

		this.markers.push(newMarker);
	}

	mutableRemove() {
		this.markers.pop();
	}

	newArray() {
		this.markers = this.markers.slice();
	}
}
