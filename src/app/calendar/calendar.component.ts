import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MeetupsService } from '../meetups.service';
import { Meetup } from '../meetup/meetup';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  template: `
    <div class="calendar-container">
      <div class="header">
        <button mat-icon-button (click)="goBack()" class="back-button">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Calendario de Citas</h1>
      </div>

      <mat-card class="calendar-card">
        <mat-card-content>
          <mat-calendar 
            [selected]="selectedDate" 
            (selectedChange)="onDateSelected($event)"
            [minDate]="minDate"
            [maxDate]="maxDate"
            class="custom-calendar">
          </mat-calendar>
        </mat-card-content>
      </mat-card>

      <mat-card *ngIf="meetupsOnSelectedDate.length > 0" class="meetups-card">
        <mat-card-header>
          <mat-card-title>Citas para el {{ selectedDate | date:"d 'de' MMMM 'de' yyyy" }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let meetup of meetupsOnSelectedDate" class="meetup-item">
            <div class="meetup-header">
              <h3>{{ meetup.name }}</h3>
              <span class="meetup-type" *ngIf="meetup.isTrip">Viaje</span>
            </div>
            <p>{{ meetup.description }}</p>
            <p *ngIf="meetup.isTrip">
              <mat-icon>event</mat-icon>
              {{ meetup.startDate | date:'dd/MM/yyyy' }} - {{ meetup.endDate | date:'dd/MM/yyyy' }}
            </p>
            <p><mat-icon>location_on</mat-icon> {{ meetup.location }}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 16px;
    }
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      flex-grow: 1;
      text-align: center;
      color: #333;
      font-size: 24px;
      font-weight: 500;
    }
    .back-button {
      color: #e91e63;
    }
    .back-button:hover {
      background-color: rgba(233, 30, 99, 0.1);
    }
    .calendar-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      padding: 16px;
    }
    .custom-calendar {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
    .meetups-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .meetup-item {
      padding: 16px;
      border-bottom: 1px solid #eee;
      transition: background-color 0.2s;
    }
    .meetup-item:last-child {
      border-bottom: none;
    }
    .meetup-item:hover {
      background-color: #f8f9fa;
    }
    .meetup-item h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 18px;
      font-weight: 500;
    }
    .meetup-item p {
      margin: 4px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }
    mat-icon {
      vertical-align: middle;
      margin-right: 4px;
      font-size: 16px;
      color: #e91e63;
    }
    ::ng-deep .mat-calendar {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      background-color: white;
    }
    ::ng-deep .mat-calendar-body-selected {
      background-color: #e91e63;
      color: white !important;
    }
    ::ng-deep .mat-calendar-body-today:not(.mat-calendar-body-selected) {
      border-color: #e91e63;
    }
    ::ng-deep .mat-calendar-header {
      padding: 8px;
      background-color: white;
    }
    ::ng-deep .mat-calendar-body-cell-content {
      height: 32px;
      width: 32px;
      border-radius: 50%;
    }
    ::ng-deep .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical) {
      background-color: rgba(233, 30, 99, 0.1);
    }
    ::ng-deep .mat-calendar-body-label {
      color: #333 !important;
    }
    ::ng-deep .mat-calendar-period-button {
      color: #333 !important;
    }
    ::ng-deep .mat-calendar-arrow {
      fill: #333 !important;
    }
    ::ng-deep .mat-calendar-body-cell-content {
      color: #333 !important;
    }
    ::ng-deep .mat-calendar-body-disabled > .mat-calendar-body-cell-content {
      color: #ccc !important;
    }
    ::ng-deep .mat-calendar-body-selected > .mat-calendar-body-cell-content {
      color: white !important;
    }
    ::ng-deep .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical) {
      background-color: rgba(233, 30, 99, 0.1);
    }
    .meetup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .meetup-type {
      background-color: #e91e63;
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
  `]
})
export class CalendarComponent implements OnInit {
  selectedDate: Date = new Date();
  meetups$: Observable<Meetup[]>;
  meetupsOnSelectedDate: Meetup[] = [];
  minDate = new Date(2024, 0, 1);
  maxDate = new Date(2025, 11, 31);

  constructor(
    private meetupsService: MeetupsService,
    private router: Router
  ) {
    this.meetups$ = this.meetupsService.getMeetups();
  }

  goBack() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.meetups$.subscribe(meetups => {
      this.updateMeetupsOnSelectedDate(meetups);
    });
  }

  onDateSelected(date: Date | null) {
    if (date) {
      this.selectedDate = date;
      this.meetups$.subscribe(meetups => {
        this.updateMeetupsOnSelectedDate(meetups);
      });
    }
  }

  private updateMeetupsOnSelectedDate(meetups: Meetup[]) {
    this.meetupsOnSelectedDate = meetups.filter(meetup => {
      const meetupStartDate = new Date(meetup.startDate);
      const meetupEndDate = new Date(meetup.endDate);
      return this.isDateInRange(this.selectedDate, meetupStartDate, meetupEndDate);
    });
  }

  private isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    return d >= start && d <= end;
  }
} 