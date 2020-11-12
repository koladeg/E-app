import * as Google from 'expo-google-app-auth';

const scopes = ['profile', 'email'];

const loginAsync = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId: "955090941360-vupr8g0a0g8nbn8cphni3s85aeibm4hs.apps.googleusercontent.com",
      iosClientId: "955090941360-qucp1avubiop8dc506cg5v4tfdonq4ge.apps.googleusercontent.com",
      scopes,
    });

    if (result.type === 'success') {
      return result.accessToken;
    }

    return Promise.reject('No success');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const GoogleApi = {
  loginAsync,
};
