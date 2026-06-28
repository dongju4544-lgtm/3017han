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

/** 하루 기록 저장 */
export async function saveDayRecord(userId: string, record: DayRecord) {
  const ref = doc(
    collection(db, "eco_records", userId, "days"),
    `day${record.day}`
  );
  await setDoc(ref, {
    ...record,
    savedAt: serverTimestamp(),
  });
}

/** 학생 전체 기록 불러오기 (day 순 정렬) */
export async function loadAllRecords(userId: string): Promise<DayRecord[]> {
  const q = query(
    collection(db, "eco_records", userId, "days"),
    orderBy("day", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DayRecord);
}
