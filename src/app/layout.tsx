import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리 동네 동물들 — 전기 사용 환경 인식 앱",
  description: "전등 사용량이 생태계에 미치는 영향을 시각적으로 확인해요",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
