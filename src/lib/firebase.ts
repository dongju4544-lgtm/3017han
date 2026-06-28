import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const requiredEnvs = {
  apiKey: "AIzaSyDwiJJVliUyvGAyjnSFrYmcc1s29qDxYaE",
  authDomain: "han-88f18.firebaseapp.com",
  projectId: "han-88f18",
  storageBucket: "han-88f18.firebasestorage.app",
  messagingSenderId: "963408949696",
  appId: "1:963408949696:web:ad0a1b6949f4e66a581825"
};

// 환경변수 누락 체크 — 브라우저 콘솔에 정확히 뭐가 빠졌는지 출력
const missing = Object.entries(requiredEnvs)
  .filter(([, v]) => !v || v.startsWith("YOUR_"))
  .map(([k]) => k);

if (missing.length > 0) {
  console.error(
    "[Firebase] ❌ 아래 환경변수가 .env.local에 없거나 YOUR_ 로 시작합니다:\n" +
    missing.map((k) => `  NEXT_PUBLIC_FIREBASE_${k.replace(/([A-Z])/g, "_$1").toUpperCase()}`).join("\n")
  );
}

const app = getApps().length === 0
  ? initializeApp(requiredEnvs)
  : getApp();

export const db = getFirestore(app);

// 연결 확인용 로그
console.log("[Firebase] projectId:", requiredEnvs.projectId ?? "❌ 없음");
