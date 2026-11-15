// API(/address/search)를 실제로 호출해 검색어별 응답 시간과 건수를 잰다.
// node bench.mjs <라벨>  →  bench-<라벨>.json
import fs from 'node:fs';

const API = process.env.API_URL ?? 'http://127.0.0.1:3000';

const TERMS = ['세종대로', '테헤란로', 'Teheran-ro', '반곡동', '역삼동', '중앙로', '해운대', 'Gangnam-daero', '한누리대로', '첨단'];
const RUNS = 7;
const label = process.argv[2] ?? 'run';
const out = [];
for (const term of TERMS) {
  const times = [];
  let total = null;
  let first = null;
  for (let i = 0; i < RUNS; i++) {
    const t = performance.now();
    const res = await fetch(`${API}/address/search?search=${encodeURIComponent(term)}&page=1&limit=10`);
    const body = await res.json();
    times.push(performance.now() - t);
    if (res.status !== 200) { total = `HTTP ${res.status}`; break; }
    total = body.pagination.totalCount;
    first = body.data[0]?.formattedAddress ?? null;
  }
  times.sort((a, b) => a - b);
  const med = times[Math.floor(times.length / 2)];
  out.push({ term, total, median_ms: +med.toFixed(1), min_ms: +times[0].toFixed(1), max_ms: +times[times.length - 1].toFixed(1), first });
  console.log(term.padEnd(16), String(total).padStart(9), `${med.toFixed(1)}ms`.padStart(10), ' ', first ?? '');
}
fs.writeFileSync(`bench-${label}.json`, JSON.stringify(out, null, 1));
