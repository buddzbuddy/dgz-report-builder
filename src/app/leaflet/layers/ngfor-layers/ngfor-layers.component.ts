import { Component } from '@angular/core';
import { icon, latLng, marker, Marker, tileLayer } from 'leaflet';
@Component({
  selector: 'app-ngfor-layers',
  templateUrl: './ngfor-layers.component.html'
})
export class NgforLayersComponent {
  // Open Street Map definitions
  LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' });

  // Values to bind to Leaflet Directive
  options = {
    layers: [ this.LAYER_OSM ],
    zoom: 10,
    center: latLng(46.879966, -121.726909)
  };

  markers: Marker[] = [];
  lat: number = 0;
  lng: number = 0;
  addMarker() {
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
  setLatLng(e) {
    this.lat = e.target._latlng.lat;
    this.lng = e.target._latlng.lng;
    alert(e.target._latlng.lat);
  }
  removeMarker() {
    this.markers.pop();
  }
}
