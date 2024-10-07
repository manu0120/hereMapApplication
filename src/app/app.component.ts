import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HereMapComponent } from "./here-map/here-map.component";
import { MappositionComponent } from "./mapposition/mapposition.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HereMapComponent, MappositionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'interestPointsApp';

  constructor() {
    this.zoom = 2;
    this.lat = 0;
    this.lng = 0;
  }

  zoom: number;
  lat: number;
  lng: number;

  // The change handler updates the values according to the user's input and Angular passes these values to the here-map component.
  handleInputChange(event: Event) {
    const target = <HTMLInputElement> event.target;
    if (target) {
      if (target.name === 'zoom') {
        this.zoom = parseFloat(target.value);
      }
      if (target.name === 'lat') {
        this.lat = parseFloat(target.value);
      }
      if (target.name === 'lng') {
        this.lng = parseFloat(target.value);
      }
    }
  }

  // El código define una función handleMapChange que toma un evento de tipo H.map.ChangeEvent. Verifica si event.newValue tiene una propiedad lookAt. Si la tiene, extrae el objeto lookAt y actualiza las propiedades zoom, lat y lng de la instancia con los valores correspondientes de lookAt. Específicamente, establece this.zoom en lookAt.zoom, this.lat en lookAt.position.lat y this.lng en lookAt.position.lng. Esta función se llamará cada vez que cambie la vista del mapa.
  handleMapChange(event: H.map.ChangeEvent) {
    if (event.newValue.lookAt) {
      const lookAt = event.newValue.lookAt;
      this.zoom = lookAt.zoom;
      this.lat = lookAt.position.lat;
      this.lng = lookAt.position.lng;
    }
  }

}
