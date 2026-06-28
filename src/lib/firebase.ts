import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const requiredEnvs = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
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
