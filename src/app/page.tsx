"use client";

import { useState, useCallback } from "react";
import Scene       from "@/components/Scene";
import InputCard   from "@/components/InputCard";
import ResultCard  from "@/components/ResultCard";
import HistoryCard from "@/components/HistoryCard";
import { calcKwh, calcCo2, calcLost, TOTAL_ANIMALS, MAX_DAYS } from "@/lib/calc";
import { saveDayRecord, loadAllRecords, DayRecord } from "@/lib/firestore";

interface CurrentResult {
  kwh: number;
  co2: number;
  lost: number;
  watt: number;
  hours: number;
}

export default function HomePage() {
  const [userId, setUserId] = useState("");
  const [watt,   setWatt]   = useState("");
  const [hours,  setHours]  = useState("");

  const [result,   setResult]   = useState<CurrentResult | null>(null);
  const [history,  setHistory]  = useState<DayRecord[]>([]);
  const [lightOn,  setLightOn]  = useState(false);
  const [dyingMap, setDyingMap] = useState<boolean[]>(Array(TOTAL_ANIMALS).fill(false));

  const [saving,   setSaving]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [saveError, setSaveError] = useState("");  // ← 에러 메시지 상태 추가
  const [toast,    setToast]    = useState("");

  const complete = history.length >= MAX_DAYS;

  /* ── 계산 ── */
  const handleCalculate = useCallback(() => {
    const w = parseFloat(watt);
    const h = parseFloat(hours);
    if (!w || w <= 0) { alert("소비 전력을 입력해주세요!"); return; }
    if (!h || h <= 0) { alert("사용 시간을 입력해주세요!"); return; }

    const kwh  = calcKwh(w, h);
    const co2  = calcCo2(kwh);
    const lost = calcLost(kwh);

    setSaveError("");
    setResult({ kwh, co2, lost, watt: w, hours: h });
    setLightOn(true);

    const dying = Array(TOTAL_ANIMALS).fill(false).map((_, i) => i >= (TOTAL_ANIMALS - lost));
    setDyingMap(dying);
  }, [watt, hours]);

  /* ── Firebase 저장 ── */
  const handleSave = useCallback(async () => {
    if (!result)        { alert("먼저 계산해주세요!"); return; }
    if (!userId.trim()) { alert("이름·번호를 입력해주세요!"); return; }
    if (complete)       { alert("5일 기록이 이미 완료됐어요!"); return; }

    const dayNum = history.length + 1;
    setSaving(true);
    setSaveError("");

    try {
      const record: DayRecord = {
        day: dayNum,
        watt: result.watt,
        hours: result.hours,
        kwh: result.kwh,
        co2: result.co2,
        lost: result.lost,
      };
      await saveDayRecord(userId.trim(), record);

      const next = [...history, record];
      setHistory(next);
      setResult(null);
      setWatt("");
      setHours("");
      setLightOn(false);
      setDyingMap(Array(TOTAL_ANIMALS).fill(false));
      showToast(`✅ ${dayNum}일차 저장 완료! (${MAX_DAYS - dayNum}일 남음)`);
    } catch (err: any) {
      // 에러를 화면에 명확히 표시
      const msg = err?.message ?? "알 수 없는 오류";
      setSaveError(msg);
      console.error("[Save Error]", err);
    } finally {
      setSaving(false);
    }
  }, [result, userId, history, complete]);

  /* ── 기록 불러오기 ── */
  const handleLoadHistory = useCallback(async () => {
    if (!userId.trim()) { alert("이름·번호를 먼저 입력해주세요!"); return; }
    setLoading(true);
    setSaveError("");
    try {
      const records = await loadAllRecords(userId.trim());
      setHistory(records);
      if (records.length === 0) showToast("저장된 기록이 없습니다.");
      else showToast(`✅ ${records.length}일치 기록을 불러왔습니다!`);
    } catch (err: any) {
      const msg = err?.message ?? "알 수 없는 오류";
      setSaveError(msg);
      console.error("[Load Error]", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /* ── 초기화 ── */
  const handleReset = useCallback(() => {
    if (!confirm("화면을 초기화할까요?\n(Firebase 저장 데이터는 유지됩니다)")) return;
    setResult(null);
    setHistory([]);
    setWatt("");
    setHours("");
    setLightOn(false);
    setDyingMap(Array(TOTAL_ANIMALS).fill(false));
    setSaveError("");
    showToast("초기화 완료");
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="min-h-screen" style={{ background: "#E8F4FD" }}>
      <Scene
        co2={result?.co2 ?? 0}
        lostCount={result?.lost ?? 0}
        lightOn={lightOn}
        dying={dyingMap}
      />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg whitespace-nowrap">
          {toast}
        </div>
      )}

      <div className="max-w-md mx-auto px-4 pb-12">
        <h1 className="text-center text-lg font-bold py-4" style={{ color: "#1A5C2A" }}>
          💡 전등을 켜면 <span className="text-red-500">동물들이 사라져요</span>
        </h1>

        {/* Firebase 에러 배너 */}
        {saveError && (
          <div className="mb-4 bg-red-50 border border-red-300 rounded-2xl p-4 text-sm text-red-700">
            <p className="font-bold mb-1">❌ 오류 발생</p>
            <p className="break-words">{saveError}</p>
            <p className="mt-2 text-xs text-red-500">
              📋 체크리스트:<br />
              1. <code>.env.local</code> 파일에 Firebase 값 6개가 모두 입력됐나요?<br />
              2. Firebase 콘솔 → Firestore → 규칙이 <code>allow read, write: if true;</code> 인가요?<br />
              3. 인터넷 연결이 되어 있나요?<br />
              4. 브라우저 개발자도구(F12) → Console 탭에서 상세 오류를 확인하세요.
            </p>
          </div>
        )}

        <InputCard
          userId={userId}
          watt={watt}
          hours={hours}
          onUserIdChange={setUserId}
          onWattChange={setWatt}
          onHoursChange={setHours}
          onCalculate={handleCalculate}
          onLoadHistory={handleLoadHistory}
          loading={loading}
        />

        {result && (
          <ResultCard
            kwh={result.kwh}
            co2={result.co2}
            lost={result.lost}
            dayCount={history.length + 1}
            onSave={handleSave}
            onReset={handleReset}
            saving={saving}
            complete={complete}
          />
        )}

        <HistoryCard records={history} />
      </div>
    </div>
  );
}
