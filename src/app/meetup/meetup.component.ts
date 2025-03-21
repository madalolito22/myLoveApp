import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Meetup } from './meetup';
import { MatCardModule } from '@angular/material/card'; 
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-meetup',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatIconModule],
  templateUrl: './meetup.component.html',
  styleUrls: ['./meetup.component.css']
})
export class MeetupComponent implements OnInit {
  @Input() meetup: Meetup | null = null;
  @Output() meetupSelected = new EventEmitter<Meetup>();
  @Output() meetupDeleted = new EventEmitter<Meetup>();

  ngOnInit() {
    console.log('MeetupComponent initialized with meetup:', this.meetup);
  }
}
