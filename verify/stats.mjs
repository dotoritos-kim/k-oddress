// 지역 단위 집계가 키 관계만으로 나오는지, 공식 자료건수와 맞는지 확인한다. 결과는 stats.json.
import pg from 'pg';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const timed = async (name, sql) => {
  const t = performance.now();
  const rows = (await c.query(sql)).rows;
  const ms = +(performance.now() - t).toFixed(0);
  console.log(`${name}: ${rows.length} rows, ${ms}ms`);
  return { ms, rows };
};
const out = {};

// 1) 시도별 주소 수: 주소 → 도로명코드(복합키)
out.by_province = await timed('시도별 주소 수', `
  select rc.province_name, count(*)::int addresses
  from address.road_address ra
  join address.road_code rc on rc.road_code_id = ra.road_name_code and rc.admin_division_serial_number = ra.admin_division_serial_number
  group by 1 order by 2 desc`);

// 공식 자료건수 파일의 "2. 주소" 절과 대조
const txt = execFileSync('iconv', ['-f', 'cp949', '-t', 'utf-8', fs.readdirSync(process.env.JUSO_DIR ?? './juso').map((f) => `${process.env.JUSO_DIR ?? './juso'}/${f}`).find((f) => f.includes('자료건수'))]).toString();
const sec = txt.split('2. 주소')[1].split('3. 지번')[0];
const official = Object.fromEntries([...sec.matchAll(/^(\S+) : ([\d,]+)/gm)].map((m) => [m[1], +m[2].replace(/,/g, '')]));
const short = (n) => n.replace(/(특별자치시|특별자치도|통합특별시|특별시|광역시)$/, '').replace(/^(충청|전라|경상)(.)도$/, (_, a, b) => a[0] + b).replace(/도$/, '');
out.official_match = out.by_province.rows.map((r) => {
  const k = short(r.province_name);
  return { province: r.province_name, loaded: r.addresses, official: official[k] ?? null, match: official[k] === r.addresses };
});
console.table(out.official_match);

// 2) 시군구별
out.by_district = await timed('시군구별 주소 수 상위', `
  select rc.province_name, rc.district_name, count(*)::int addresses
  from address.road_address ra
  join address.road_code rc on rc.road_code_id = ra.road_name_code and rc.admin_division_serial_number = ra.admin_division_serial_number
  group by 1, 2 order by 3 desc limit 5`);

// 3) 우편번호별: 주소 → 부가정보(관리번호)
out.by_postal = await timed('우편번호별 주소 수', `
  select count(distinct ai.postal_code)::int postal_codes, count(*)::int addresses
  from address.additional_information ai`);
out.top_postal = await timed('주소가 가장 많은 우편번호', `
  select ai.postal_code, count(*)::int addresses from address.additional_information ai group by 1 order by 2 desc limit 3`);

// 4) 행정동별: 부가정보의 행정동 코드
out.by_admin_dong = await timed('행정동 수와 행정동별 평균 주소 수', `
  select count(*)::int admin_dongs, round(avg(n))::int avg_addresses, max(n)::int max_addresses
  from (select administrative_district_code, count(*) n from address.additional_information group by 1) x`);

// 5) 시도별 공동주택 비율: 도로명코드 → 주소 → 부가정보, 세 테이블을 한 번에
out.apartment_ratio = await timed('시도별 공동주택 비율', `
  select rc.province_name,
         count(*)::int addresses,
         count(*) filter (where ai.multi_unit_housing_status = '1')::int multi_unit,
         round(100.0 * count(*) filter (where ai.multi_unit_housing_status = '1') / count(*), 2)::float pct
  from address.road_address ra
  join address.road_code rc on rc.road_code_id = ra.road_name_code and rc.admin_division_serial_number = ra.admin_division_serial_number
  join address.additional_information ai on ai.additional_information_id = ra.road_address_id
  group by 1 order by 4 desc limit 5`);

// 6) 법정동별 지번 수: 지번의 법정동 코드
out.by_legal_dong = await timed('법정동(리) 수와 관련 지번 비율', `
  select count(distinct legal_district_code)::int legal_dongs,
         count(*)::int lots,
         count(*) filter (where "representative_YN" = '0')::int related_lots
  from address.street_number`);

fs.writeFileSync('stats.json', JSON.stringify(out, null, 1));
for (const k of ['by_district', 'by_postal', 'top_postal', 'by_admin_dong', 'apartment_ratio', 'by_legal_dong']) console.log(k, JSON.stringify(out[k].rows));
await c.end();
