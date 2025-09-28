# Photo Gallery App

A modern, AI-powered photo gallery application built with React Native and Expo. Features voice recognition, smart captions, and intelligent photo organization.

## Features

- 📸 **Photo Management**: Capture, organize, and manage your photo collection
- 🎤 **Voice Recognition**: Add voice-powered captions to your photos
- 🔍 **Smart Search**: Find photos using AI-powered search and hashtags
- 🌙 **Beautiful Themes**: Light and dark mode support
- 🔐 **Secure Authentication**: Google OAuth and email/password authentication
- 📱 **Cross-Platform**: Works on iOS, Android, and Web

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router
- **UI**: NativeWind (Tailwind CSS for React Native)
- **Authentication**: Expo Auth Session with Google OAuth
- **Voice Recognition**: Web Speech API and React Native Voice
- **Storage**: AsyncStorage and Expo SecureStore
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd photo-gallery-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - For iOS: Press `i` in the terminal or scan the QR code with your iPhone
   - For Android: Press `a` in the terminal or scan the QR code with your Android device
   - For Web: Press `w` in the terminal or visit the local URL

## Configuration

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Update the `CLIENT_ID` in `services/googleAuthService.ts`

### Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Project Structure

```
├── app/                    # App screens and navigation
├── components/             # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── services/              # API and external service integrations
├── types/                 # TypeScript type definitions
└── assets/                # Images, fonts, and other static assets
```

## Features in Detail

### Voice Recognition
- Real-time voice-to-text conversion
- Multiple voice recognition approaches for better compatibility
- Fallback to text input when voice recognition is unavailable

### Smart Photo Organization
- Automatic photo categorization
- AI-powered search capabilities
- Custom hashtag system

### Authentication
- Secure user authentication
- Google OAuth integration
- Account management and profile editing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository.
