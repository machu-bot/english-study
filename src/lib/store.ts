// localStorage 학습 로거 — 영어 학습 사이트 핵심 데이터 레이어
// 모든 데이터는 브라우저 localStorage에만 저장 (서버 없음, 백업 책임은 본인)

export type Area = 'vocab' | 'listening' | 'reading' | 'speaking' | 'writing';

export interface VocabEntry {
  id: string;
  word: string;
  definition: string;   // 영영 정의
  example: string;      // 예문
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  notes?: string;
  createdAt: number;
  reviews: number;      // 복습 횟수
}

export interface LogEntry {
  id: string;
  area: Area;
  title: string;
  source?: string;      // 팟캐스트명 / 아티클 URL / 영상 등
  duration?: number;    // 분
  reflection?: string;  // 배운 점 메모
  rating?: 1 | 2 | 3 | 4 | 5;
  createdAt: number;
}

export interface DailyTask {
  id: string;
  area: Area;
  text: string;
  done: boolean;
  date: string;         // YYYY-MM-DD
}

export interface Assessment {
  understanding: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  vocab:         'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  listening:     'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  reading:       'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  speaking:      'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  writing:       'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  updatedAt: number;
}

const KEY_VOCAB = 'es.vocab.v1';
const KEY_LOG   = 'es.log.v1';
const KEY_TASK  = 'es.task.v1';
const KEY_ASMT  = 'es.asmt.v1';
const KEY_STREAK = 'es.streak.v1';

const uid = () => Math.random().toString(36).slice(2, 10);

const read = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
};

const write = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// ---------- vocab ----------
export const getVocab = (): VocabEntry[] => read<VocabEntry[]>(KEY_VOCAB, []);
export const addVocab = (e: Omit<VocabEntry, 'id' | 'createdAt' | 'reviews'>): VocabEntry => {
  const entry: VocabEntry = { ...e, id: uid(), createdAt: Date.now(), reviews: 0 };
  const list = [entry, ...getVocab()];
  write(KEY_VOCAB, list);
  return entry;
};
export const deleteVocab = (id: string) => write(KEY_VOCAB, getVocab().filter(v => v.id !== id));
export const reviewVocab = (id: string) =>
  write(KEY_VOCAB, getVocab().map(v => v.id === id ? { ...v, reviews: v.reviews + 1 } : v));

// ---------- logs (listening/reading/speaking/writing) ----------
export const getLogs = (area?: Area): LogEntry[] => {
  const all = read<LogEntry[]>(KEY_LOG, []);
  return area ? all.filter(l => l.area === area) : all;
};
export const addLog = (e: Omit<LogEntry, 'id' | 'createdAt'>): LogEntry => {
  const entry: LogEntry = { ...e, id: uid(), createdAt: Date.now() };
  write(KEY_LOG, [entry, ...getLogs()]);
  bumpStreak();
  return entry;
};
export const deleteLog = (id: string) => write(KEY_LOG, getLogs().filter(l => l.id !== id));

// ---------- daily tasks ----------
export const today = () => new Date().toISOString().slice(0, 10);

export const getTasks = (): DailyTask[] => {
  const all = read<DailyTask[]>(KEY_TASK, []);
  return all.filter(t => t.date === today());
};
export const setTasks = (tasks: DailyTask[]) => write(KEY_TASK, tasks);
export const toggleTask = (id: string) => {
  const tasks = read<DailyTask[]>(KEY_TASK, []).map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  write(KEY_TASK, tasks);
};

// ---------- CEFR assessment ----------
const emptyAssessment = (): Assessment => ({
  understanding: null, vocab: null, listening: null,
  reading: null, speaking: null, writing: null,
  updatedAt: Date.now(),
});
export const getAssessment = (): Assessment =>
  read<Assessment>(KEY_ASMT, emptyAssessment());
export const saveAssessment = (a: Assessment) =>
  write(KEY_ASMT, { ...a, updatedAt: Date.now() });

// ---------- streak ----------
export const getStreak = (): number => read<number>(KEY_STREAK, 0);
export const bumpStreak = () => {
  const last = read<string>('es.streak.last', '');
  const t = today();
  if (last === t) return;
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const cur = getStreak();
  write(KEY_STREAK, last === y ? cur + 1 : 1);
  write('es.streak.last', t);
};

// ---------- seed (1회만) ----------
export const seedIfEmpty = () => {
  if (typeof window === 'undefined') return;
  if (read<string>('es.seeded', '') === 'v1') return;

  // 기본 일일 task 5개
  const seed: DailyTask[] = [
    { id: uid(), area: 'vocab',    text: '단어 5개 외우기 (영영 정의 + 예문)', done: false, date: today() },
    { id: uid(), area: 'listening', text: '팟캐스트/영상 10분 듣기 (쉐도잉)',    done: false, date: today() },
    { id: uid(), area: 'reading',   text: '영어 아티클 1개 읽고 메모',           done: false, date: today() },
    { id: uid(), area: 'speaking',  text: '오늘 배운 문장 3개 소리내어 말하기',    done: false, date: today() },
    { id: uid(), area: 'writing',   text: '영어 일기 3문장 쓰기',                 done: false, date: today() },
  ];
  write(KEY_TASK, seed);
  write('es.seeded', 'v1');
};

// area → 표시 이름
export const AREA_LABEL: Record<Area, string> = {
  vocab: 'Vocabulary',
  listening: 'Listening',
  reading: 'Reading',
  speaking: 'Speaking',
  writing: 'Writing',
};

// CEFR 짧은 설명
export const CEFR_DESC: Record<string, string> = {
  A1: '기초 — 알파벳·인사·기본 문장',
  A2: '초급 — 일상 표현·간단한 문장',
  B1: '중급 — 친숙한 주제 처리 가능',
  B2: '중상급 — 복잡한 글/대화 이해',
  C1: '고급 — 유창한 표현, 학술적 사용',
  C2: '숙달 — 원어민 수준에 근접',
};