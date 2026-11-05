import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase";
import { config } from "../config/env";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account", hd: config.allowedDomain });
  provider.addScope("email");
  const result = await signInWithPopup(auth, provider);
  return result.user;
}
