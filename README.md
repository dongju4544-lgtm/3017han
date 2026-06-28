# 🌿 우리 동네 동물들 — 전기 사용 환경 인식 앱

전등 사용량이 생태계에 미치는 영향을 시각적으로 확인하는 교육용 앱입니다.

## 기술 스택
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: Firebase Firestore (5일 누적 기록 저장)
- **배포**: Vercel

---

## 1. Firebase 설정

1. [Firebase 콘솔](https://console.firebase.google.com) → **프로젝트 만들기**
2. **Firestore Database** → 데이터베이스 만들기 → **테스트 모드**로 시작
3. 프로젝트 설정(⚙️) → 내 앱 → **웹앱 추가** → SDK 구성 복사

---

## 2. 환경변수 설정

`.env.local` 파일에 Firebase 값을 입력하세요:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=복사한값
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=복사한값
NEXT_PUBLIC_FIREBASE_PROJECT_ID=복사한값
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=복사한값
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=복사한값
NEXT_PUBLIC_FIREBASE_APP_ID=복사한값
```

> ⚠️ `.env.local`은 절대 GitHub에 올리지 마세요! (`.gitignore`에 포함됨)

---

## 3. 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## 4. Vercel 배포

1. GitHub에 코드 push
2. [Vercel](https://vercel.com) → **Add New Project** → GitHub 저장소 선택
3. **Environment Variables** 탭에 `.env.local`의 값 6개 입력
4. **Deploy** 클릭

---

## 5. Firestore 보안 규칙 (선택)

Firebase 콘솔 → Firestore → 규칙 탭에서 설정:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 학생 기록: 누구나 읽기/쓰기 (교실 내 공개 사용)
    match /eco_records/{userId}/days/{dayId} {
      allow read, write: if true;
    }
  }
}
```

---

## 앱 사용 방법

1. **이름·번호 입력** (예: `홍길동_3반_12번`)
2. **전등 종류 선택** 또는 소비전력 직접 입력
3. **사용 시간 입력** 후 **환경 영향 확인하기** 클릭
4. 화면의 동물들이 전력량에 따라 사라짐
5. **오늘 기록 저장하기** 클릭 → Firebase 저장
6. 다음 날 다시 접속 → **기록 불러오기** 클릭 → 누적 기록 복원
7. **5일** 기록 완료 시 최종 누적 결과 표시

## 피드백 기준

| 남은 동물 수 | 메시지 |
|---|---|
| 8~10마리 | "환경을 잘 지키고 있어! 고마워!" |
| 5~7마리  | "조금 더 사용시간을 줄여줘!" |
| 1~4마리  | "친구들이 발전소의 이산화탄소 때문에 사라져버렸어…" |
| 0마리    | "당신의 전자기기 과사용으로 인해 동물들이 멸종해버렸습니다" |
