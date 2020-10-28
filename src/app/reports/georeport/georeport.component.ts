import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, marker, point, polyline, tileLayer } from 'leaflet';

@Component({
  selector: 'app-georeport',
  templateUrl: './georeport.component.html',
  styleUrls: ['./georeport.component.scss']
})
export class GeoreportComponent implements OnInit {
// Define our base layers so we can reference them multiple times
streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Marker for the top of Mt. Ranier
summit = marker([ 42.864672669219985, 74.63034957647325 ], {
  icon: icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })
});

// Marker for the parking lot at the base of Mt. Ranier trails
paradise = marker([ 42.86549443443018,74.6322445540256 ], {
  icon: icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })
});

// Path from paradise to summit - most points omitted from this example for brevity
route = polyline([[ 42.86549443443018,74.6322445540256 ],
  [ 42.86463335003618, 74.63403961621178 ],
  [ 42.86387841685092, 74.63354350979818 ],
  [ 42.86187841683092, 74.63154350079818 ],
  [ 42.86487841684092, 74.63454350999818 ],
  [ 42.86287841686092, 74.63254350989818 ],
  [ 42.864672669219985, 74.63034957647325 ]]);

// Layers control object with our two base layers and the three overlay layers
layersControl = {
  baseLayers: {
    'Street Maps': this.streetMaps,
    'Wikimedia Maps': this.wMaps
  },
  overlays: {
    'Начало': this.summit,
    'Конец': this.paradise,
    'Перемещение': this.route
  }
};
// Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
options = {
  layers: [ this.streetMaps, this.route, this.summit, this.paradise ],
  zoom: 17,
  center: latLng([ 42.86463335003618, 74.63403961621178 ])
};
constructor() { }

ngOnInit() {
}
onMapReady(map: Map) {
  map.fitBounds(this.route.getBounds(), {
    padding: point(24, 24),
    maxZoom: 12,
    animate: true
  });
}
}
