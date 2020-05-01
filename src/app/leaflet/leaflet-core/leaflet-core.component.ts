import { Component, OnInit } from '@angular/core';
import { latLng, LatLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-leaflet-core',
  templateUrl: './leaflet-core.component.html'
})
export class LeafletCoreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  optionsSpec: any = {
		layers: [{ url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attribution: 'Open Street Map' }],
		zoom: 12,
		center: [ 42.865563917814136, 74.63687839992807 ]
	};

	// Leaflet bindings
	zoom = this.optionsSpec.zoom;
	center = latLng(this.optionsSpec.center);
	options = {
		layers: [ tileLayer(this.optionsSpec.layers[0].url, { attribution: this.optionsSpec.layers[0].attribution }) ],
		zoom: this.optionsSpec.zoom,
		center: latLng(this.optionsSpec.center)
	};

	// Form bindings
	formZoom = this.zoom;
	zoomLevels = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ];
	lat = this.center.lat;
	lng = this.center.lng;

	// Output binding for center
	onCenterChange(center: LatLng) {
		setTimeout(() => {
			this.lat = center.lat;
			this.lng = center.lng;
		});
	}

	onZoomChange(zoom: number) {
		setTimeout(() => {
			this.formZoom = zoom;
		});
	}

	doApply() {
		this.center = latLng(this.lat, this.lng);
		this.zoom = this.formZoom;
	}
}
