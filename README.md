# UP - Katitirok | Grand Alumni Web Gallery

An elegant, commemorative digital exhibition space designed to archive and celebrate the smiles, reunions, achievements, and legacy of the University of the Philippines Alumni. This Single Page Application (SPA) features a dynamic interactive gallery, real-time community engagement, client-side media optimization, customizable branding, and a hidden administration system.

---

## 🌟 Key Features

### 1. Interactive Gallery & Media Showcases
- **Auto-Playing Hero Carousel**: Showcases the latest highlighted memories with elegant text overlays, badges, and detail views.
- **Dynamic Grid Layout**: Displays approved photos in an aesthetically pleasing card grid, complete with real-time stats and hover micro-animations.
- **Multi-Category Filtering**: Instantly filters photos by "All", "Your Uploads" (custom submissions), or specific batches (e.g., "Batch 89") and custom-created categories.
- **Lightbox Details View**: Zoom in on any photo to read its background story, see total views/likes, and participate in a live memory sharing (comments) section.

### 2. Community Engagement Features
- **Client-Identified Like System**: Tracks likes using a unique client ID stored in browser storage to toggle likes per-device (prevents rapid fake likes).
- **Session-Based Views Counter**: Increments views unique to the current browser session.
- **Shared Memory Board (Comments)**: Allows visitors to post named comments on any memory card. Admins can moderate/delete inappropriate comments directly from the lightbox.

### 3. Smart Contributor Flow
- **Drag-and-Drop Dropzone**: Drag files directly into the upload area or click to select files.
- **Client-Side Image Optimization**: Uses HTML5 Canvas API to compress and resize images client-side to a maximum dimension of 1000px and 70% JPEG quality before uploading, keeping storage and database transfer lightweight.
- **Dynamic Category Creation**: Contributors can select from existing categories or define a new one. All uploads are placed in a queue awaiting admin approval.

### 4. Secret Admin & Moderation Portal
- **Logo-Tap Gesture**: Tap or click the main logo exactly **three times** within one second to access the secret Admin Portal.
- **Credentials**: Use default username `admin` and password `admin` to log in (session-restricted).
- **Control Center Dashboard**:
  - **Live Stat Cards**: Quick-glance metrics of Approved Photos, Total Likes, and Total Views.
  - **Pending Approvals Queue**: Approve or permanently decline submissions.
  - **Gallery Management Panel**: Remove published items and modify captions on-the-fly.
  - **Live Branding Customizer**: Change the navigation logo (initials or custom image file), update the App Title, and customize the subtitle without writing code.

---

## 🛠️ Technical Stack

- **Frontend**: Vanilla HTML5, CSS3, & Modern ES6 JavaScript.
- **Icons**: [FontAwesome 6.4.0](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css).
- **Database & Storage Layer**: Dual-Mode Database Support.
  - **Firebase Sync Mode**: Integrates Firebase Firestore and Firebase Storage when credentials are provided in `firebase-config.js`. Uses real-time listeners (`onSnapshot`) to update client screens instantaneously.
  - **Local Demo Mode**: Seamless fallback to browser `localStorage` when Firebase is not configured. Automatically seeds default memories from the local assets.

---

## 📁 File Structure

```text
fantastic-octo-potato/
│
├── assets/                     # Static assets (images, pre-seeded memories)
│   └── Batch 89/
│
├── index.html                  # Main layout, structures, and modal templates
├── style.css                   # Premium CSS design tokens, animations, and typography
├── app.js                      # Core JS logic, state management, and dual-mode data layer
├── firebase-config.js          # Firebase SDK configurations and API keys
└── README.md                   # Documentation (this file)
```

---

## ⚙️ Configuration & Deployment

### Run Locally
Since this is a client-side SPA, you can open it directly in any modern browser:
1. Double-click [index.html](file:///d:/Karl/Projects/fantastic-octo-potato/index.html) or run a local dev server (e.g., Live Server in VS Code, `http-server` via npm, or Python's `http.server`).
2. If Firebase credentials are not pasted or invalid, the app runs in **Local Demo Mode** and saves all actions (likes, uploads, comments, branding changes) directly to your local browser storage.

### Connect Firebase (Global Sync Mode)
To synchronize photos, likes, and comments globally across multiple users:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new Firebase project and register a Web App.
3. **Enable Services**:
   - Enable **Cloud Firestore** and **Firebase Storage**.
   - Enable **Firebase Authentication** and turn on the **Email/Password** sign-in provider. Create an administrator user account (e.g., `admin@katitirok.com` with a strong password).
4. Copy the web app configuration object and paste it into [firebase-config.js](file:///d:/Karl/Projects/fantastic-octo-potato/firebase-config.js):
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
     messagingSenderId: "SENDER_ID",
     appId: "APP_ID"
   };
   ```
5. Reload the app. The browser console will log: `"Firebase Sync Mode Active! 🔥"`.

### Recommended Firestore Security Rules
To secure your production database so that only authenticated administrators can alter content, deploy these rules in the Firebase console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /settings/branding {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /photos/{photoId} {
      allow read: if true;
      // Anyone can submit new photos for review (approved starts as false)
      allow create: if request.resource.data.approved == false;
      // Only authenticated users can approve, edit captions, or delete photos/comments
      allow update, delete: if request.auth != null;
    }
  }
}
```

---

## 🔐 Administrative Access

To moderate the gallery:
1. Navigate to the top navigation bar.
2. Click the **KATITIROK** logo **3 times** within 1 second.
3. In the Admin Login Card, enter your credentials:
   - **Firebase Sync Mode**: Enter the **Email** and **Password** registered in your Firebase Authentication console (e.g. `admin@katitirok.com`).
   - **Local Demo Mode**: Enter the local mock credentials:
     - **Username**: `admin`
     - **Password**: `oncue`
4. Modify settings or moderate the galleries. To return to the public gallery, click the **Logout** button or click the logo again to toggle views.

