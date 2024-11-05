# Netflix Clone

A Netflix clone built using React, Firebase for authentication, Firestore for user data management, and Firebase Storage for profile image storage.

## Prerequisites

- **Node.js** and **npm** should be installed on your machine.
- A **Firebase** project configured with:
  - **Firestore** for the database,
  - **Authentication** for user sign-in,
  - **Storage** for image management.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/netflix-clone.git
cd netflix-clone
```

### 2. Install dependencies

Run the following command to install the required packages:

```bash
npm install
```

### 3. Firebase Configuration

Update the Firebase configuration file in `src/config/firebase.js`. Replace the configuration values with your own Firebase project's credentials:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
  measurementId: 'your-measurement-id',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(app);
const storage = getStorage();

export { app, auth, db, storage };
```

**Important:** Be cautious when pushing your Firebase credentials to public repositories. If testing, make sure these keys have limited permissions or set up a `.env` file to load them securely.

### 4. Start the Application

To run the app in development mode, use:

```bash
npm run dev
```

This will start the application on `http://localhost:5173`.

### Features

**User Authentication:** Sign up and log in using Firebase Authentication.

**Profile Image Upload:** Upload and display profile pictures using Firebase Storage.

**Favorites and Liked Lists:** Save and view your favorite movies and liked movies using Firestore.

**Responsive Design:** Optimized layout for desktop and mobile devices.

### Deployment

You can deploy the app using Firebase Hosting or any other hosting service of your choice.
