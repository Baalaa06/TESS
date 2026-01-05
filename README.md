# TESS - Trust-First Emergency Safety System

A React Native app built with Expo that demonstrates trust-aware emergency response.

## Core Concept

Most safety apps ask "Is the user in danger?"
**TESS asks "Can the system be trusted right now?"**

## Features

- **Trust Status Dashboard**: Real-time system health monitoring
- **Smart SOS Button**: Context-aware emergency response
- **Trust-Aware Decisions**: Adapts response based on system reliability
- **False Alarm Detection**: Learns from usage patterns
- **Incident Timeline**: Complete log of all emergency events

## How It Works

1. **System Health Monitoring**: Continuously monitors battery, network, and sensors
2. **Context Analysis**: Tracks time and movement patterns to detect false alarms
3. **Trust Calculation**: Combines all factors into a trust score (0-100%)
4. **Adaptive Response**:
   - **High Trust (75%+)**: Instant emergency alert
   - **Medium Trust (45-74%)**: 5-second confirmation window
   - **Low Trust (<45%)**: SMS fallback with retries

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Add your config to `src/config/firebase.js`
   - If not configured, app will use local storage fallback

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Open in Expo Go app or simulator

## Tech Stack

- React Native with Expo
- Firebase Firestore (optional - with local fallback)
- Expo Battery API
- Expo Network API
- Expo Sensors (Accelerometer)
- AsyncStorage for local data fallback

## Usage

1. **Trust Dashboard**: View current system trust status and health metrics
2. **Press SOS**: Trigger emergency evaluation and response
3. **View Logs**: Check incident timeline and system decisions

## Trust Factors

- **Battery Level**: Low battery reduces trust
- **Network Status**: Offline reduces trust
- **Sensor Availability**: Missing sensors reduce trust
- **Context History**: Repeated false alarms reduce sensitivity

## Firebase Setup (Optional)

1. Create Firebase project
2. Enable Firestore Database
3. Add your config to `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Safety Features

- Always errs on the side of caution
- Fallback mechanisms for system failures
- Clear explanations for all decisions
- No background surveillance or recording
- Works offline with local storage

---
