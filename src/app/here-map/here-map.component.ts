import { Component, ViewChild, ElementRef, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';

@Component({
  selector: 'app-here-map',
  standalone: true,
  imports: [],
  templateUrl: './here-map.component.html',
  styleUrl: './here-map.component.css'
})
export class HereMapComponent {
  private map?: H.Map;

  @ViewChild('map') mapDiv?: ElementRef;
  ngAfterViewInit(): void {
    if (!this.map && this.mapDiv) {
      // Instantiate a platform, default layers and a map as usual.
      const platform = new H.service.Platform({
        apikey: 'mdoO1CTIG2NXiprDRYUDymtubmFa5AUXYlIEshdWcHI'
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(
        this.mapDiv.nativeElement,
        (layers as any).vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          // In this example, the map centers on
          // Luxembourg City, with the zoom level of 16:
          zoom: 11,
          center: {  lat: 40.472568, lng: -3.582778 }
        },
      );
            // Llama a la función onResize con el elemento nativo de mapDiv y una función de callback
      onResize(this.mapDiv.nativeElement, () => {
          // Dentro del callback, redimensiona el viewport del mapa
          map.getViewPort().resize();
      });

      // enables the interactive behaviour after the map instantiation
      map.addEventListener('mapviewchange', (ev: H.map.ChangeEvent) => {
        this.notify.emit(ev)
      });
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // This array stores coordinates of some interesting landmarks in Luxembourg City:
      const landmarks = [
        {name: 'Santander España SSCC', lat:40.44819562197407, lng:-3.632831374666546}
      ];
      landmarks.forEach(landmark => {
        const marker = new H.map.Marker({ lat: landmark.lat, lng: landmark.lng });
        marker.setData(landmark.name);
        map.addObject(marker);
      });
      this.map = map;
    }
  }

  @Input() public zoom = 2;
  @Input() public lat = 0;
  @Input() public lng = 0;

  // Now, your Angular application can take your input with the help of the mapposition component, store the state in the app component, and then update the here-map component so that the map responds to the input.

  private timeoutHandle: any;
  @Output() notify = new EventEmitter();
  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes['zoom'] !== undefined) {
        this.map.setZoom(changes['zoom'].currentValue);
      }
      if (changes['lat'] !== undefined) {
        this.map.setCenter({lat: changes['lat'].currentValue, lng: this.lng});
      }
      if (changes['lng'] !== undefined) {
        this.map.setCenter({lat: this.lat, lng: changes['lng'].currentValue});
      }
    }
  }
}
