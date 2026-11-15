// 공공 주소 DB(cp949, | 구분)를 UTF-8 로 바꿔 레포 스키마의 네 테이블에 COPY 로 넣는다.
import pg from 'pg';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// JUSO_DIR: 주소 DB 전체분 zip 을 푼 폴더(cp949 원문)
const RAW = path.resolve(process.env.JUSO_DIR ?? './juso');
const UTF = path.join(RAW, 'utf8');
fs.mkdirSync(UTF, { recursive: true });

const MAP = [
  ['개선_도로명코드_', 'address.road_code'],
  ['주소_', 'address.road_address'],
  ['지번_', 'address.street_number'],
  ['부가정보_', 'address.additional_information'],
];

const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
await c.query(fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8'));

const t0 = Date.now();
const counts = {};
for (const f of fs.readdirSync(RAW).sort()) {
  const hit = MAP.find(([p]) => f.startsWith(p));
  if (!hit || !f.endsWith('.txt')) continue;
  const out = path.join(UTF, f);
  if (!fs.existsSync(out)) {
    const buf = execFileSync('iconv', ['-f', 'cp949', '-t', 'utf-8', path.join(RAW, f)], { maxBuffer: 1 << 30 });
    fs.writeFileSync(out, buf);
  }
  const t = Date.now();
  // csv 형식에 쓰이지 않는 문자를 따옴표로 지정해 | 구분 원문을 그대로 읽는다. 빈 칸은 NULL.
  const r = await c.query(`COPY ${hit[1]} FROM '${out.replace(/'/g, "''")}' WITH (FORMAT csv, DELIMITER '|', QUOTE E'\\b', NULL '')`);
  counts[hit[1]] = (counts[hit[1]] || 0) + r.rowCount;
  console.log(`${hit[1]} ${f} ${r.rowCount} rows ${Date.now() - t}ms`);
}
await c.query('ANALYZE');
console.log('TOTAL', counts, `${((Date.now() - t0) / 1000).toFixed(1)}s`);
await c.end();
