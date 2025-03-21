import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, Timestamp, getDocs } from '@angular/fire/firestore';
import { Observable, map, catchError, from } from 'rxjs';
import { Meetup } from './models/meetup';

@Injectable({
  providedIn: 'root'
})
export class MeetupsService {
  private firestore = inject(Firestore);

  getMeetups(): Observable<Meetup[]> {
    const meetupsRef = collection(this.firestore, 'meetups');
    const q = query(meetupsRef, orderBy('startDate', 'asc'));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => {
        const meetups = docs.map(doc => {
          const data = doc as any;
          return {
            id: data.id,
            name: data.name || '',
            description: data.description || '',
            startDate: (data.startDate as Timestamp).toDate(),
            endDate: data.endDate ? (data.endDate as Timestamp).toDate() : (data.startDate as Timestamp).toDate(),
            location: data.location || '',
            isTrip: data.isTrip || false
          };
        });
        console.log('Fetched meetups:', meetups);
        return meetups;
      }),
      catchError(error => {
        console.error('Error fetching meetups:', error);
        return [];
      })
    );
  }

  async addMeetup(meetup: Omit<Meetup, 'id'>): Promise<void> {
    // Validate all required fields using the correct property names
    if (!meetup.name?.trim() || 
        !meetup.description?.trim() || 
        !meetup.location?.trim() || 
        !meetup.startDate || 
        !meetup.endDate) {
      throw new Error('All fields are required');
    }

    // Only proceed if all fields are valid
    const meetupsCollection = collection(this.firestore, 'meetups');
    await addDoc(meetupsCollection, {
      ...meetup,
      startDate: Timestamp.fromDate(meetup.startDate),
      endDate: Timestamp.fromDate(meetup.endDate)
    });
  }

  async deleteMeetup(id: string): Promise<void> {
    const meetupRef = doc(this.firestore, `meetups/${id}`);
    console.log('Deleting meetup:', id);
    try {
      await deleteDoc(meetupRef);
      console.log('Meetup deleted successfully');
    } catch (error) {
      console.error('Error deleting meetup:', error);
      throw error;
    }
  }
}
