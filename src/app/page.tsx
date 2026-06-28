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
  /* ── 입력 상태 ── */
  const [userId, setUserId] = useState("");
  const [watt,   setWatt]   = useState("");
  const [hours,  setHours]  = useState("");

  /* ── 결과 상태 ── */
  const [result,    setResult]    = useState<CurrentResult | null>(null);
  const [history,   setHistory]   = useState<DayRecord[]>([]);
  const [lightOn,   setLightOn]   = useState(false);
  const [dyingMap,  setDyingMap]  = useState<boolean[]>(Array(TOTAL_ANIMALS).fill(false));

  /* ── 로딩 상태 ── */
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState("");

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

    setResult({ kwh, co2, lost, watt: w, hours: h });
    setLightOn(true);

    // 동물 죽어가는 애니메이션
    const dying = Array(TOTAL_ANIMALS).fill(false).map((_, i) => i >= (TOTAL_ANIMALS - lost));
    setDyingMap(dying);
  }, [watt, hours]);

  /* ── Firebase 저장 ── */
  const handleSave = useCallback(async () => {
    if (!result)           { alert("먼저 계산해주세요!"); return; }
    if (!userId.trim())    { alert("이름·번호를 입력해주세요!"); return; }
    if (complete)          { alert("이미 5일 기록이 완료됐어요!"); return; }

    const dayNum = history.length + 1;
    setSaving(true);

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
      alert("저장 실패: " + err.message);
    } finally {
      setSaving(false);
    }
  }, [result, userId, history, complete]);

  /* ── 기록 불러오기 ── */
  const handleLoadHistory = useCallback(async () => {
    if (!userId.trim()) { alert("이름·번호를 먼저 입력해주세요!"); return; }
    setLoading(true);
    try {
      const records = await loadAllRecords(userId.trim());
      setHistory(records);
      if (records.length === 0) showToast("저장된 기록이 없습니다.");
      else                      showToast(`✅ ${records.length}일치 기록을 불러왔습니다!`);
    } catch (err: any) {
      alert("불러오기 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /* ── 초기화 ── */
  const handleReset = useCallback(() => {
    if (!confirm("로컬 기록을 초기화할까요?\n(Firebase에 저장된 데이터는 유지됩니다)")) return;
    setResult(null);
    setHistory([]);
    setWatt("");
    setHours("");
    setLightOn(false);
    setDyingMap(Array(TOTAL_ANIMALS).fill(false));
    showToast("초기화 완료");
  }, []);

  /* ── 토스트 ── */
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const co2Display  = result?.co2  ?? 0;
  const lostDisplay = result?.lost ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "#E8F4FD" }}>
      {/* 장면 */}
      <Scene
        co2={co2Display}
        lostCount={lostDisplay}
        lightOn={lightOn}
        dying={dyingMap}
      />

      {/* 토스트 */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      {/* 앱 컨텐츠 */}
      <div className="max-w-md mx-auto px-4 pb-12">
        <h1 className="text-center text-lg font-bold py-4" style={{ color: "#1A5C2A" }}>
          💡 전등을 켜면 <span className="text-red-500">동물들이 사라져요</span>
        </h1>

        {/* 입력 */}
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

        {/* 결과 */}
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

        {/* 누적 기록 */}
        <HistoryCard records={history} />
      </div>
    </div>
  );
}
