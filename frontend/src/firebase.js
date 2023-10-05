import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD4E07m3aseaw72j8MvWiXpK32ZBx4Yfjg",
  authDomain: "kaptenenbrf-7b7f0.firebaseapp.com",
  projectId: "kaptenenbrf-7b7f0",
  storageBucket: "kaptenenbrf-7b7f0.appspot.com",
  messagingSenderId: "533979771379",
  appId: "1:533979771379:web:4af5f9cae35f83a1c3a286",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
