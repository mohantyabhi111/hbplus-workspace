import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";
import { config } from "../config/env";

GoogleSignin.configure({
  webClientId: config.googleWebClientId,
  iosClientId: config.googleIosClientId,
  offlineAccess: false
});

export async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error("Google did not return an ID token. Check OAuth client configuration.");
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) throw new Error("Google sign-in was cancelled.");
    if (error?.code === statusCodes.IN_PROGRESS) throw new Error("Google sign-in is already in progress.");
    if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) throw new Error("Google Play Services is unavailable.");
    throw error;
  }
}
