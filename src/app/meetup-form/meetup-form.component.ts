import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Meetup } from '../meetup/meetup';
import { LocationPickerComponent } from '../location-picker/location-picker.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    LocationPickerComponent,
    MatProgressSpinnerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ meetup.isTrip ? 'Nuevo Viaje' : 'Nueva Cita' }}</h2>
    <form #meetupForm="ngForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="meetup.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="meetup.description" name="description" required></textarea>
        </mat-form-field>

        <app-location-picker
          [(location)]="meetup.location"
          (locationChange)="onLocationChange($event)"
          (photoUrlChange)="onPhotoUrlChange($event)">
        </app-location-picker>

        <!-- Debug info -->
        <div *ngIf="!photoUrl" class="no-photo-message">
          No hay foto disponible para esta ubicación
        </div>
        
        <!-- Photo display -->
        <div *ngIf="photoUrl" class="photo-container">
          <img [src]="photoUrl" 
               alt="Foto de la ubicación" 
               class="location-photo"
               (error)="handleImageError($event)"
               crossorigin="anonymous">
        </div>

        <!-- Show loading state -->
        <div *ngIf="isLoadingPhoto" class="photo-loading">
          <mat-spinner diameter="40"></mat-spinner>
          <span>Cargando foto...</span>
        </div>

        <mat-checkbox [(ngModel)]="meetup.isTrip" name="isTrip" (change)="onTripChange($event)" class="trip-checkbox">
          Es un viaje
        </mat-checkbox>

        <div *ngIf="meetup.isTrip">
          <mat-form-field appearance="fill">
            <mat-label>Fecha de inicio</mat-label>
            <input matInput [matDatepicker]="startPicker" [(ngModel)]="meetup.startDate" name="startDate" required>
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill">
            <mat-label>Fecha de fin</mat-label>
            <input matInput [matDatepicker]="endPicker" [(ngModel)]="meetup.endDate" name="endDate" required>
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>
        </div>

        <div *ngIf="!meetup.isTrip">
          <mat-form-field appearance="fill">
            <mat-label>Fecha</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="meetup.startDate" name="date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!meetupForm.form.valid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    .trip-checkbox {
      margin-bottom: 1rem;
    }
    ::ng-deep .mat-checkbox-label {
      color: #000 !important;
      font-weight: 500;
    }
    ::ng-deep .mat-checkbox-inner-container {
      margin-right: 8px;
    }
    ::ng-deep .mat-checkbox-checked .mat-checkbox-background {
      background-color: #e91e63;
    }
    .location-photo {
      width: 100%;
      max-width: 400px;
      height: 300px;
      object-fit: cover;
      margin-top: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .no-photo-message {
      color: #f44336;
      margin-bottom: 1rem;
    }
    .photo-container {
      margin-bottom: 1rem;
    }
    .photo-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      color: #666;
    }
  `]
})
export class MeetupFormComponent {
  meetup: Meetup = {
    id: '',
    name: '',
    description: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    isTrip: false
  };

  photoUrl: string = '';
  isLoadingPhoto = false;

  constructor(
    public dialogRef: MatDialogRef<MeetupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit' }
  ) {}

  onTripChange(event: any) {
    if (!event.checked) {
      this.meetup.endDate = this.meetup.startDate;
    }
  }

  onLocationChange(location: string) {
    this.meetup.location = location;
  }

  onPhotoUrlChange(url: string) {
    console.log('Photo URL changed:', url);
    this.isLoadingPhoto = true;
    if (url) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.photoUrl = url;
        this.isLoadingPhoto = false;
      };
      img.onerror = () => {
        console.error('Error loading image');
        this.photoUrl = '';
        this.isLoadingPhoto = false;
      };
      img.src = url;
    } else {
      this.photoUrl = '';
      this.isLoadingPhoto = false;
    }
  }

  onSubmit() {
    if (!this.meetup.isTrip) {
      this.meetup.endDate = this.meetup.startDate;
    }
    this.dialogRef.close(this.meetup);
  }

  onCancel() {
    this.dialogRef.close();
  }

  handleImageError(event: any) {
    console.error('Error loading image:', event);
    this.photoUrl = '';
  }
} 