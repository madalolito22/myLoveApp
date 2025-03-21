import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

declare global {
  interface Window {
    google: typeof google;
    googleMapsLoaded: boolean;
  }
}

interface LatLng {
  lat(): number;
  lng(): number;
}

interface GeocoderResult {
  geometry: {
    location: LatLng;
  };
  formatted_address: string;
  place_id: string;
}

interface GoogleMapsTypes {
  maps: {
    Map: any;
    LatLng: new (lat: number, lng: number) => LatLng;
    Geocoder: {
      new(): {
        geocode(request: { address?: string; location?: LatLng }, 
          callback: (results: GeocoderResult[], status: string) => void): void;
      };
    };
    Marker: any;
    places: {
      Autocomplete: any;
      SearchBox: any;
      PlacesService: {
        new(map: any): {
          nearbySearch(request: {
            location: any;
            radius: number;
          }, callback: (
            results: GoogleMapsTypes['maps']['places']['PlaceResult'][] | null,
            status: string
          ) => void): void;
          getDetails(request: {
            placeId: string;
            fields: string[];
          }, callback: (place: GoogleMapsTypes['maps']['places']['PlaceResult'], status: string) => void): void;
        };
      };
      PlaceResult: {
        formatted_address: string;
        geometry: {
          location: LatLng;
        };
        photos?: {
          getUrl: (opts: { maxWidth?: number; maxHeight?: number }) => string;
        }[];
        place_id: string;
      };
      PlacesServiceStatus: {
        OK: 'OK';
        ZERO_RESULTS: 'ZERO_RESULTS';
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT';
        REQUEST_DENIED: 'REQUEST_DENIED';
        INVALID_REQUEST: 'INVALID_REQUEST';
        UNKNOWN_ERROR: 'UNKNOWN_ERROR';
      };
    };
    marker: {
      AdvancedMarkerElement: any;
      PinView: any;
    };
  };
}

declare const google: GoogleMapsTypes;

interface MapsLibrary {
  Map: any;
}

interface MarkerLibrary {
  Marker: any;
}

interface GeocodingLibrary {
  Geocoder: any;
}

interface PlacesLibrary {
  Autocomplete: any;
}

// Add this interface for error handling
interface PlacesError extends Error {
  message: string;
}

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MatIconModule, MatButtonModule],
  template: `
    <div class="location-picker-container">
      <mat-form-field appearance="fill" class="location-picker">
        <mat-label>Ubicación</mat-label>
        <input matInput
               #locationInput
               [(ngModel)]="location"
               (click)="showMapValue = true"
               placeholder="Busca una ubicación"
               required>
        <mat-icon matSuffix>location_on</mat-icon>
      </mat-form-field>

      <div *ngIf="showMapValue" class="map-overlay-container">
        <div class="map-container">
          <div *ngIf="!isGoogleMapsLoaded" class="map-error">
            <mat-icon>error_outline</mat-icon>
            <p>Error al cargar Google Maps</p>
            <p class="error-details">Por favor, asegúrate de que la API key esté correctamente configurada.</p>
          </div>
          <div *ngIf="isGoogleMapsLoaded" #mapContainer class="map"></div>
          <button mat-icon-button class="close-button" (click)="showMapValue = false">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .location-picker-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .location-picker {
      width: 100%;
    }
    .map-overlay-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .map-container {
      width: 90%;
      max-width: 800px;
      height: 600px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      position: relative;
      background-color: white;
    }
    .map {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
    .map-error {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .map-error mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #e91e63;
      margin-bottom: 1rem;
    }
    .error-details {
      font-size: 0.9rem;
      color: #999;
      margin-top: 0.5rem;
    }
    .close-button {
      position: absolute;
      top: 8px;
      right: 8px;
      background-color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      z-index: 1001;
    }
    ::ng-deep .mat-mdc-form-field {
      width: 100%;
    }
    ::ng-deep .mat-mdc-form-field-flex {
      background-color: white;
    }
    ::ng-deep .mat-mdc-form-field-infix {
      padding: 16px 12px;
      border-top: none;
    }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    ::ng-deep .mat-mdc-form-field-label {
      color: #666;
    }
    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-label {
      color: #e91e63;
    }
    ::ng-deep .mat-mdc-form-field-underline {
      background-color: #e0e0e0;
    }
    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-underline {
      background-color: #e91e63;
    }
    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-form-field-ripple {
      background-color: #e91e63;
    }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    ::ng-deep .mat-mdc-form-field-icon-suffix {
      color: #e91e63;
    }
  `]
})
export class LocationPickerComponent implements OnInit, AfterViewInit {
  @ViewChild('locationInput') locationInput!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Output() locationChange = new EventEmitter<string>();
  @Output() photoUrlChange = new EventEmitter<string>();

  @Input()
  set location(value: string) {
    if (!this.showMap) {
      this.originalLocation = value;
    }
    this._location = value;
  }

  get location(): string {
    return this._location;
  }

  private _location: string = '';
  private originalLocation: string = '';
  private map: any;
  private marker: any;
  private geocoder: any;
  private autocomplete: any;
  showMap = false;
  isGoogleMapsLoaded = false;
  private defaultLocation = { lat: 40.416775, lng: -3.703790 }; // Madrid coordinates as fallback
  private userLocation: LatLng | null = null;
  searchQuery: string = '';
  error: string = '';
  private placesService: any;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Remove the direct initialization call
  }

  ngAfterViewInit() {
    // Initialize Google Maps after the view is ready
    this.initializeGoogleMaps();
  }

  private async initializeGoogleMaps() {
    if (window.google && window.google.maps) {
      this.isGoogleMapsLoaded = true;
      await this.getUserLocation();
      // Don't initialize map here, wait for showMapValue to be set
    } else {
      this.error = 'Google Maps no está disponible';
      console.error('Google Maps not loaded');
    }
  }

  private getUserLocation(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by this browser');
        this.userLocation = new google.maps.LatLng(
          this.defaultLocation.lat,
          this.defaultLocation.lng
        );
        resolve();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          console.log('User location:', this.userLocation);
          resolve();
        },
        (error) => {
          console.warn('Error getting user location:', error);
          this.userLocation = new google.maps.LatLng(
            this.defaultLocation.lat,
            this.defaultLocation.lng
          );
          resolve();
        }
      );
    });
  }

  private async initializeMap(): Promise<void> {
    // Wait for the marker library to be fully loaded
    if (!window.google?.maps?.marker?.AdvancedMarkerElement) {
      console.log('Waiting for Advanced Marker library to load...');
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.initializeMap();
    }

    if (!this.mapContainer?.nativeElement) {
      console.error('Map container not found');
      return;
    }

    const container = this.mapContainer.nativeElement;
    container.style.display = 'block';

    // Create the map
    this.map = new google.maps.Map(container, {
      center: this.userLocation || this.defaultLocation,
      zoom: 13,
      mapId: 'YOUR_MAP_ID',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });

    // Create a marker using AdvancedMarkerElement instead of standard Marker
    const { AdvancedMarkerElement } = google.maps.marker;
    this.marker = new AdvancedMarkerElement({
      position: this.userLocation || new google.maps.LatLng(
        this.defaultLocation.lat,
        this.defaultLocation.lng
      ),
      map: this.map
    });

    // Add click listener to the map
    this.map.addListener('click', (event: any) => {
      const clickedLocation = event.latLng;
      this.updateMarkerPosition(clickedLocation);
    });

    // If we have a location string, try to geocode it
    if (this.location) {
      this.geocodeLocation(this.location);
    }
  }

  private initializeAutocomplete() {
    if (!this.locationInput?.nativeElement) {
      console.error('Location input not found');
      return;
    }

    try {
      this.autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement, {
        types: ['address'],
        componentRestrictions: { country: 'es' },
        fields: ['formatted_address', 'geometry', 'photos']
      });

      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace();
        if (place.geometry) {
          this.updateMarkerPosition(place.geometry.location);
          this.location = place.formatted_address;
          this.locationChange.emit(this.location);
          this.getPlacePhoto(place);
        }
      });
    } catch (error) {
      console.error('Error initializing autocomplete:', error);
      this.snackBar.open('Error al inicializar la búsqueda de lugares. Por favor, intenta de nuevo.', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  private updateMarkerPosition(latLng: any) {
    if (this.marker) {
      this.marker.position = latLng;
      this.map.setCenter(latLng);
      this.updateLocationFromMarker();
    }
  }

  private async getPlaceDetailsWithRetry(placeId: string, retries = 3): Promise<GoogleMapsTypes['maps']['places']['PlaceResult']> {
    try {
      if (!this.placesService) {
        this.placesService = new google.maps.places.PlacesService(this.map);
      }

      return await new Promise((resolve, reject) => {
        this.placesService.getDetails({
          placeId: placeId,
          fields: ['photos', 'formatted_address']
        }, (
          place: GoogleMapsTypes['maps']['places']['PlaceResult'],
          status: keyof GoogleMapsTypes['maps']['places']['PlacesServiceStatus']
        ) => {
          if (status === 'OK') {
            resolve(place);
          } else if (status === 'REQUEST_DENIED' && retries > 0) {
            reject(new Error('REQUEST_DENIED'));
          } else {
            reject(new Error(`Places Details error: ${status}`));
          }
        });
      });
    } catch (error) {
      if (retries > 0 && (error as PlacesError).message === 'REQUEST_DENIED') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.getPlaceDetailsWithRetry(placeId, retries - 1);
      }
      throw error;
    }
  }

  private updateLocationFromMarker() {
    if (!this.marker) return;
    
    const position = this.marker.position;
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode(
      { location: position },
      async (results: GeocoderResult[], status: string) => {
        if (status === 'OK' && results[0]) {
          this.location = results[0].formatted_address;
          this.locationChange.emit(this.location);
          
          if (results[0].place_id) {
            try {
              const place = await this.getPlaceDetailsWithRetry(results[0].place_id);
              this.getPlacePhoto(place);
            } catch (error) {
              console.error('Final error getting place details:', error);
              this.photoUrlChange.emit('');
            }
          }
        } else {
          console.error('Geocoding error:', status);
          this.snackBar.open(
            'Error al obtener la dirección del lugar seleccionado.',
            'Cerrar',
            { duration: 5000 }
          );
        }
      }
    );
  }

  onLocationChange(value: string) {
    this.locationChange.emit(value);
  }

  // Update the showMapValue setter
  set showMapValue(value: boolean) {
    if (!value) {
      // When closing the map (cancel), revert to the previous location
      this.revertLocation();
    }
    
    this.showMap = value;
    if (value && this.isGoogleMapsLoaded) {
      // Wait for the next tick to ensure the container is rendered
      setTimeout(() => {
        if (this.mapContainer?.nativeElement) {
          this.initializeMap();
          this.initializeAutocomplete();
        }
      }, 100);
    }
  }

  get showMapValue(): boolean {
    return this.showMap;
  }

  // Add method to revert location
  private revertLocation() {
    if (this._location !== this.originalLocation) {
      this._location = this.originalLocation;
      // Only emit if we're reverting to a non-empty location
      if (this.originalLocation) {
        this.locationChange.emit(this.originalLocation);
      }
    }
  }

  private async geocodeLocation(address: string) {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (results: GeocoderResult[], status: string) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      
      if (result[0]) {
        const location = result[0].geometry.location;
        this.updateMapLocation(location);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  }

  private updateMapLocation(location: LatLng) {
    if (this.map && this.marker) {
      this.map.setCenter(location);
      this.marker.position = location;
      this.updateLocationString(location);
    }
  }

  private async updateLocationString(location: LatLng) {
    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<{ results: GeocoderResult[] }>((resolve, reject) => {
        geocoder.geocode({ location }, (results: GeocoderResult[], status: string) => {
          if (status === 'OK') {
            resolve({ results });
          } else {
            reject(status);
          }
        });
      });
      
      if (result.results[0]) {
        this.location = result.results[0].formatted_address;
        this.locationChange.emit(this.location);
      }
    } catch (error) {
      console.error('Error geocoding location:', error);
    }
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
  }

  private async getPlacePhoto(
    place: GoogleMapsTypes['maps']['places']['PlaceResult'], 
    retries = 3
  ): Promise<void> {
    this.photoUrlChange.emit(''); // Clear existing photo
    
    if (!place.photos || place.photos.length === 0) {
      console.log('No photos available for this place');
      return;
    }

    console.log('Found photos for place:', place.photos.length);
    const photo = place.photos[0];

    try {
      // Use only maxWidth to avoid the type error
      const photoUrl = photo.getUrl({
        maxWidth: 400
      });
      
      // Create a proxy URL using the Places Photo API endpoint
      const proxyUrl = photoUrl.replace(
        'https://maps.googleapis.com/maps/api/place/js/PhotoService.GetPhoto',
        'https://maps.googleapis.com/maps/api/place/photo'
      );

      console.log('Photo URL generated:', proxyUrl);
      
      // Test if the URL is accessible
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        console.log('Photo loaded successfully');
        this.photoUrlChange.emit(proxyUrl);
      };
      img.onerror = () => {
        console.error('Error loading photo');
        if (retries > 0) {
          console.log(`Retrying with different parameters. Attempts left: ${retries}`);
          setTimeout(() => {
            this.getPlacePhoto(place, retries - 1);
          }, 1000);
        } else {
          this.photoUrlChange.emit('');
        }
      };
      img.src = proxyUrl;
    } catch (error) {
      console.error('Error getting photo URL:', error);
      this.photoUrlChange.emit('');
    }
  }

  private async initPlacesWithRetry(retries = 3): Promise<void> {
    try {
      if (!google.maps.places) {
        throw new Error('Places API not available');
      }

      this.placesService = new google.maps.places.PlacesService(this.map);
      
      await new Promise((resolve, reject) => {
        this.placesService.nearbySearch({
          location: this.map.getCenter(),
          radius: 1000,
        }, (
          results: GoogleMapsTypes['maps']['places']['PlaceResult'][] | null,
          status: keyof GoogleMapsTypes['maps']['places']['PlacesServiceStatus']
        ) => {
          if (status === 'OK') {
            console.log('Places service initialized successfully');
            resolve(results);
          } else if (status === 'REQUEST_DENIED' && retries > 0) {
            console.log(`Retrying Places service initialization. Attempts left: ${retries}`);
            reject(new Error('REQUEST_DENIED'));
          } else {
            reject(new Error(`Places service error: ${status}`));
          }
        });
      });
    } catch (error) {
      if (retries > 0 && (error as PlacesError).message.includes('REQUEST_DENIED')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.initPlacesWithRetry(retries - 1);
      }
      throw error;
    }
  }
} 