import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetupsService } from '../services/meetups.service';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-create-meetup',
  templateUrl: './create-meetup.component.html',
  styleUrls: ['./create-meetup.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CreateMeetupComponent {
  meetupForm: FormGroup;
  locationPhotoUrl: string = '';
  isLoadingPhoto: boolean = false;

  constructor(
    private fb: FormBuilder,
    private meetupsService: MeetupsService,
    private router: Router
  ) {
    this.meetupForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  async onSubmit() {
    // Log form values for debugging
    console.log('Form values:', {
      name: this.meetupForm.get('name')?.value,
      description: this.meetupForm.get('description')?.value,
      location: this.meetupForm.get('location')?.value,
      startDate: this.meetupForm.get('startDate')?.value,
      endDate: this.meetupForm.get('endDate')?.value
    });

    // Check each field individually
    const name = this.meetupForm.get('name')?.value?.trim();
    const description = this.meetupForm.get('description')?.value?.trim();
    const location = this.meetupForm.get('location')?.value?.trim();
    const startDate = this.meetupForm.get('startDate')?.value;
    const endDate = this.meetupForm.get('endDate')?.value;

    if (!name || !description || !location || !startDate || !endDate) {
      console.error('Missing required fields:', {
        name: !name,
        description: !description,
        location: !location,
        startDate: !startDate,
        endDate: !endDate
      });
      
      // Mark all fields as touched to show validation errors
      Object.keys(this.meetupForm.controls).forEach(key => {
        const control = this.meetupForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    try {
      const meetup: Omit<Meetup, 'id'> = {
        name,
        description,
        location,
        startDate,
        endDate,
        isTrip: false
      };
      
      await this.meetupsService.addMeetup(meetup);
      // Handle successful creation
      this.router.navigate(['/']); // Add this if you want to navigate after success
    } catch (error) {
      console.error('Error creating meetup:', error);
    }
  }

  onLocationChange(value: string) {
    this.meetupForm.patchValue({ location: value });
    this.isLoadingPhoto = true;
  }

  onPhotoUrlChange(photoUrl: string) {
    if (photoUrl) {
      console.log('Received photo URL:', photoUrl);
      this.locationPhotoUrl = photoUrl;
    } else {
      console.log('No photo URL received');
      this.locationPhotoUrl = '';
    }
    this.isLoadingPhoto = false;
  }
} 