# Firebase Setup Guide – Smart Adda

Follow these steps to set up the backend for your Smart Adda project.

---

## 1. Firebase Project Creation
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project called **"Smart Adda"**.
3. Enable **Authentication** (Email/Password).
4. Enable **Cloud Firestore** in Test Mode (or apply rules below).
5. Add a **Web App** and copy the `firebaseConfig` keys into your `.env` file.

---

## 2. Cloud Firestore Rules
Go to the **Rules** tab in Firestore and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Buses and Routes (Public read, Admin write)
    match /buses/{busId} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
    }
    
    // Chat messages
    match /chats/{chatId} {
      allow read: if request.auth != null && (resource.data.userId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
    }

    // Driver locations
    match /drivers/{driverId} {
      allow read: if true;
      allow write: if request.auth != null && (request.auth.uid == driverId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

---

## 3. Database Schema (Collection Details)

### `users`
- `uid` (string)
- `name` (string)
- `email` (string)
- `role` (string): 'passenger', 'driver', 'admin'
- `createdAt` (timestamp)

### `buses`
- `busId` (string)
- `name` (string): e.g., "Daewoo Express"
- `luxuryClass` (string): "Luxury Gold", "Executive"
- `from` (string)
- `to` (string)
- `date` (string)
- `time` (string)
- `totalSeats` (number): 40
- `price` (number)

### `bookings`
- `userId` (string)
- `busId` (string)
- `seats` (array of numbers)
- `totalPrice` (number)
- `status` (string): 'confirmed', 'pending', 'cancelled'

### `drivers`
- `driverId` (string) - Matches Auth UID
- `currentLocation` (geopoint/map): `{ lat: ..., lng: ... }`
- `tripActive` (boolean)
- `assignedBus` (string)

---

## 4. Google Maps Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Enable **Maps JavaScript API**.
3. Create an API Key and add it to `VITE_GOOGLE_MAPS_API_KEY` in `.env`.

---

## 5. Deployment
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`
