import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwiJJVliUyvGAyjnSFrYmcc1s29qDxYaE",
  authDomain: "han-88f18.firebaseapp.com",
  projectId: "han-88f18",
  storageBucket: "han-88f18.firebasestorage.app",
  messagingSenderId: "963408949696",
  appId: "1:963408949696:web:ad0a1b6949f4e66a581825"
};

// 중복 초기화 방지
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
