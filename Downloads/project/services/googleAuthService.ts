import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';

// Google OAuth Configuration
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; // Replace with your actual client ID
const GOOGLE_USER_INFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

// Discovery document for Google OAuth2
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface GoogleAuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function signInWithGoogle(): Promise<GoogleAuthResult> {
  try {
    // Create redirect URI for Expo
    const redirectUri = AuthSession.makeRedirectUri();

    // Create auth request
    const request = new AuthSession.AuthRequest({
      clientId: CLIENT_ID,
      scopes: ['email', 'profile'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      extraParams: {},
    });


    // Start the authentication session
    const result = await request.promptAsync(discovery);


    if (result.type === 'success' && result.params?.access_token) {
      // Fetch user profile from Google
      const userInfoResponse = await fetch(GOOGLE_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${result.params.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user profile from Google');
      }

      const googleProfile = await userInfoResponse.json();

      // Convert Google profile to our User format
      const user: User = {
        id: googleProfile.sub || `google_${Date.now()}`,
        name: googleProfile.name || 'Google User',
        email: googleProfile.email || '',
        picture: googleProfile.picture || '',
        bio: '',
        location: '',
        website: '',
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      // Store user securely
      await SecureStore.setItemAsync('google_user', JSON.stringify(user));
      await SecureStore.setItemAsync('google_access_token', result.params.access_token);

      return { success: true, user };
    } else if (result.type === 'error') {
      console.error('Google OAuth error:', result.error);
      return { 
        success: false, 
        error: result.error?.message || 'Authentication failed' 
      };
    } else {
      return { 
        success: false, 
        error: 'Authentication was cancelled' 
      };
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
}

export async function signOutGoogle(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('google_user');
    await SecureStore.deleteItemAsync('google_access_token');
  } catch (error) {
    console.error('Error signing out from Google:', error);
  }
}

export async function getStoredGoogleUser(): Promise<User | null> {
  try {
    const storedUser = await SecureStore.getItemAsync('google_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error retrieving stored Google user:', error);
    return null;
  }
}

// For development/demo purposes - you can use this test client ID
// In production, replace with your actual Google OAuth client ID
export const DEMO_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com';

// Instructions for setting up Google OAuth:
/*
1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Create credentials for:
   - Web application (for Expo web)
   - Android (for Android builds)
   - iOS (for iOS builds)
6. Add authorized redirect URIs:
   - For Expo development: https://auth.expo.io/@your-username/your-app-slug
   - For web: your domain
7. Replace CLIENT_ID above with your actual client ID
*/

