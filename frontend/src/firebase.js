import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsXltzjFmyyjCyCYl1t1q33N1AX7SScyE",
  authDomain: "brfkaptenen-8d5d3.firebaseapp.com",
  projectId: "brfkaptenen-8d5d3",
  storageBucket: "brfkaptenen-8d5d3.appspot.com",
  messagingSenderId: "762693885269",
  appId: "1:762693885269:web:cdb22e189015a789f7e3dc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
