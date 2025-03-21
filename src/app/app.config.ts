import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, signInAnonymously } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBik2mhX5AI1Xg_XoWgI3lMEimL4IX_O2Q",
  authDomain: "myloveapp-405a7.firebaseapp.com",
  projectId: "myloveapp-405a7",
  storageBucket: "myloveapp-405a7.firebasestorage.app",
  messagingSenderId: "959641613783",
  appId: "1:959641613783:web:c10e845254d558f8e88792",
  measurementId: "G-TYBH4B2EJ2"
};

// Add your Google Maps API key here
export const googleMapsConfig = {
  apiKey: "AIzaSyAPA7iJr99rDJJOPFY4g1ewf_8XkU_UZQg" // Replace with your actual Google Maps API key
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => {
      const auth = getAuth();
      signInAnonymously(auth).catch((error) => {
        console.error('Error signing in anonymously:', error);
      });
      return auth;
    }),
    provideFirestore(() => getFirestore())
  ]
};
