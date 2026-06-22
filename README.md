# English. — Self-Study Tracker

영어 학습 tracker. **AI 없이**, **localStorage만**으로 동작합니다.

## 구조

가이드 [byoungd/English-level-up-tips](https://github.com/byoungd/English-level-up-tips)의 *원칙*을 차용했습니다 (라이선스: CC BY-NC 4.0). 본문/예문은 포함되어 있지 않으며, **구조와 메타 규칙만** 참고했습니다.

| 영역 | 페이지 | 기능 |
|------|--------|------|
| Today | `/` | 일일 task 5개, streak, 16-segment progress |
| Assessment | `/assessment` | CEFR 셀프체크 (6영역 × A1~C2) |
| Vocabulary | `/vocabulary` | 영영 정의 + 예문 + 복습 카운트, CEFR 필터 |
| Listening | `/listening` | 팟캐스트/영상 세션 로그 (rating, 분) |
| Reading | `/reading` | 아티클 메모 + URL |
| Speaking | `/speaking` | 쉐도잉/연습 로그 |
| Writing | `/writing` | 짧은 영어 일기/에세이 |
| About | `/about` | 원칙 + JSON export/import |

## 원칙

- **Input first** — 읽기·듣기가 출력보다 먼저
- **i + 1** — 지금보다 약간 어려운 콘텐츠
- **Re-encounter** — 새 단어를 7번 다른 맥락에서 재만남
- **Productive** — input만으로 부족, 직접 쓰고 말하기
- **Consistency** — 매일 30분이 일주일 5시간보다 나음

## 데이터

모든 학습 기록은 브라우저 `localStorage`에만 저장됩니다. 브라우저 캐시 삭제 시 데이터가 사라질 수 있으니, About 페이지의 **EXPORT JSON**으로 주기적 백업하세요.

## 라이선스

본 사이트 자체: MIT. 참고 가이드: [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).