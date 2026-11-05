import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { config } from "./env";

const app = getApps().length ? getApp() : initializeApp(config.firebase);
export const auth = getAuth(app);
export const db = getFirestore(app);
