import { Component, Input, OnInit } from '@angular/core';
import { icon, LatLng, latLng, Layer, Map, marker, point, polyline, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit {
  _map: Map
  constructor() { 
    
  }

  @Input()res: any = null
  ngOnInit() {
    console.log(this.res.geoItems)
    let firstMarker = marker([ this.res.geoItems[0][0], this.res.geoItems[0][1] ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    });
    firstMarker.bindPopup('Начало')
		this.markers.push(firstMarker);
    let lastMarker = marker([ this.res.geoItems[this.res.geoItems.length - 1][0], this.res.geoItems[this.res.geoItems.length - 1][1] ], {
      icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    });
    lastMarker.bindPopup('Конец');
    this.markers.push(lastMarker);

    this.markers.push(polyline(this.res.geoItems));
    //this.options.layers.push()
  }
// Define our base layers so we can reference them multiple times
markers: Layer[] = [];
streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  detectRetina: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


mapRoute = this.res != null ? polyline(this.res.geoItems) : null;

// Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)
options = {
  layers: [ this.streetMaps ],
  zoom: 17
};

onMapReady(map: Map) {
  this._map = map;
  map.fitBounds(polyline(this.res.geoItems).getBounds(), {
    maxZoom: 18,
    animate: true
  });
}
}
