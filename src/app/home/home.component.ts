import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MeetupComponent } from "../meetup/meetup.component";
import { Meetup } from '../meetup/meetup';
import { MeetupsService } from '../meetups.service';
import { MeetupFormComponent } from '../meetup-form/meetup-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MeetupComponent,
    MatDialogModule,
    MatTooltipModule,
    RouterLink,
    MatCardModule
  ],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>favorite</mat-icon>
      <span>MyLoveApp</span>
      <span class="spacer"></span>
      <button mat-icon-button routerLink="/calendar" matTooltip="Ver Calendario">
        <mat-icon>calendar_today</mat-icon>
      </button>
      <button mat-icon-button (click)="openAddMeetupForm()" matTooltip="Agregar Cita">
        <mat-icon>add</mat-icon>
      </button>
    </mat-toolbar>

    <div class="content">
      <div class="upcoming-trips" *ngIf="upcomingTrips.length > 0">
        <h2>Tus próximos viajes</h2>
        <div class="trips-grid">
          <mat-card *ngFor="let trip of upcomingTrips" class="trip-card">
            <mat-card-header>
              <mat-card-title>{{ trip.name }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="location"><mat-icon>location_on</mat-icon> {{ trip.location }}</p>
              <p class="dates">
                <mat-icon>event</mat-icon>
                {{ trip.startDate | date:'dd/MM/yyyy' }} - {{ trip.endDate | date:'dd/MM/yyyy' }}
              </p>
              <p class="description">{{ trip.description }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-icon-button color="warn" (click)="onMeetupDeleted(trip)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>

      <div class="meetups-section">
        <h2>Próximas citas</h2>
        <app-meetup *ngFor="let meetup of regularMeetups" [meetup]="meetup" (meetupDeleted)="onMeetupDeleted($event)"></app-meetup>
      </div>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9; /* Light background for contrast */
      border-radius: 8px; /* Rounded corners */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    }
    .upcoming-trips {
      margin-bottom: 40px;
    }
    h2 {
      color: #333; /* Darker color for better readability */
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e91e63; /* Consistent accent color */
      text-align: left;
    }
    .trips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .trip-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
      transition: transform 0.2s ease, box-shadow 0.2s ease; /* Smooth transition */
      position: relative;
    }
    .trip-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2); /* Deeper shadow on hover */
    }
    .location, .dates {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666; /* Slightly lighter color for secondary text */
      margin: 8px 0;
    }
    .location mat-icon, .dates mat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      font-size: 20px;
      color: #e91e63; /* Consistent icon color */
    }
    .description {
      color: #444; /* Darker color for better readability */
      margin: 12px 0;
      line-height: 1.6; /* Improved line height for readability */
    }
    .meetups-section {
      margin-top: 40px;
    }
    ::ng-deep .trip-card .mat-mdc-card-actions {
      padding: 0;
      margin: 0;
      position: absolute;
      top: 8px;
      right: 8px;
    }
    ::ng-deep .trip-card .mat-mdc-card-actions button {
      background-color: #f44336; /* Vibrant red */
      border: none; /* Remove border */
      border-radius: 50%; /* Circular button */
      width: 36px; /* Increased size */
      height: 36px; /* Increased size */
      padding: 0; /* Remove padding */
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Added shadow */
      transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth transition */
      display: flex; /* Use flexbox for alignment */
      align-items: center; /* Center icon vertically */
      justify-content: center; /* Center icon horizontally */
      margin-top: 4px; /* Adjust margin to lower the button */
    }
    ::ng-deep .trip-card .mat-mdc-card-actions button:hover {
      background-color: #d32f2f; /* Darker red on hover */
      transform: scale(1.1); /* Slightly enlarge on hover */
    }
    ::ng-deep .trip-card .mat-mdc-card-actions mat-icon {
      font-size: 20px; /* Adjusted icon size */
      color: white; /* White icon color for contrast */
    }
  `]
})
export class HomeComponent {
  meetups: Meetup[] = [];
  upcomingTrips: Meetup[] = [];
  regularMeetups: Meetup[] = [];

  constructor(
    private meetupsService: MeetupsService,
    private dialog: MatDialog
  ) {
    this.meetupsService.getMeetups().subscribe({
      next: (meetups) => {
        console.log('Meetups loaded:', meetups);
        this.meetups = meetups;
        this.updateMeetupsLists();
      },
      error: (error) => {
        console.error('Error loading meetups:', error);
      }
    });
  }

  private updateMeetupsLists() {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
    console.log('Current date:', now);
    console.log('Updating meetups lists. Total meetups:', this.meetups.length);
    
    this.upcomingTrips = this.meetups
      .filter(meetup => {
        const meetupDate = new Date(meetup.startDate);
        meetupDate.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
        console.log('Checking trip:', meetup.name, 'Date:', meetupDate);
        return meetup.isTrip && meetupDate >= now;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    console.log('Upcoming trips:', this.upcomingTrips.length);

    this.regularMeetups = this.meetups
      .filter(meetup => {
        const meetupDate = new Date(meetup.startDate);
        meetupDate.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
        console.log('Checking regular meetup:', meetup.name, 'Date:', meetupDate);
        return !meetup.isTrip && meetupDate >= now;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    console.log('Regular meetups:', this.regularMeetups.length);
  }

  openAddMeetupForm() {
    const dialogRef = this.dialog.open(MeetupFormComponent, {
      width: '400px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New meetup to add:', result);
        this.meetupsService.addMeetup(result).then(() => {
          console.log('Meetup added successfully');
          this.meetupsService.getMeetups().subscribe(meetups => {
            console.log('Meetups reloaded after adding:', meetups);
            this.meetups = meetups;
            this.updateMeetupsLists();
          });
        }).catch(error => {
          console.error('Error adding meetup:', error);
        });
      }
    });
  }

  onMeetupDeleted(meetup: Meetup) {
    this.meetupsService.deleteMeetup(meetup.id).then(() => {
      this.meetups = this.meetups.filter(m => m.id !== meetup.id);
      this.updateMeetupsLists();
    }).catch(error => {
      console.error('Error deleting meetup:', error);
      // You might want to show an error message to the user here
    });
  }
} 