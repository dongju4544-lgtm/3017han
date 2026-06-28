import {
  doc,
  collection,
  setDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface DayRecord {
  day: number;
  watt: number;
  hours: number;
  kwh: number;
  co2: number;
  lost: number;
}

/** 하루 기록 저장 — 타임아웃 10초 */
export async function saveDayRecord(userId: string, record: DayRecord): Promise<void> {
  const ref = doc(db, "eco_records", userId, "days", `day${record.day}`);

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("저장 시간 초과 (10초). 인터넷 연결과 Firebase 설정을 확인하세요.")), 10000)
  );

  await Promise.race([
    setDoc(ref, { ...record, savedAt: serverTimestamp() }),
    timeoutPromise,
  ]);
}

/** 전체 기록 불러오기 */
export async function loadAllRecords(userId: string): Promise<DayRecord[]> {
  const q = query(
    collection(db, "eco_records", userId, "days"),
    orderBy("day", "asc")
  );

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("불러오기 시간 초과 (10초). 인터넷 연결과 Firebase 설정을 확인하세요.")), 10000)
  );

  const snap = await Promise.race([getDocs(q), timeoutPromise]);
  return snap.docs.map((d) => d.data() as DayRecord);
}
