// 관계 무결성, 페이지 일관성, 입력 검증, 알려진 주소를 확인한다. 결과는 check.json.
import pg from 'pg';
import fs from 'node:fs';

const API = process.env.API_URL ?? 'http://127.0.0.1:3000';

const c = new pg.Client({ connectionString: process.env.DATABASE_URL });
await c.connect();
const one = async (sql) => (await c.query(sql)).rows[0];
const api = async (qs) => {
  const res = await fetch(`${API}/address/search?${qs}`);
  return { status: res.status, body: await res.json() };
};
const out = {};

// 1) 관계 무결성: 복합키와 관리번호로 고아 행이 없는지
out.integrity = {
  road_address_without_road_code: +(await one(`select count(*) n from address.road_address ra where not exists (select 1 from address.road_code rc where rc.road_code_id = ra.road_name_code and rc.admin_division_serial_number = ra.admin_division_serial_number)`)).n,
  road_address_without_representative_lot: +(await one(`select count(*) n from address.road_address ra where not exists (select 1 from address.street_number sn where sn.street_number_id = ra.road_address_id and sn."representative_YN" = '1')`)).n,
  road_address_without_additional_information: +(await one(`select count(*) n from address.road_address ra where not exists (select 1 from address.additional_information ai where ai.additional_information_id = ra.road_address_id)`)).n,
  street_number_without_road_address: +(await one(`select count(*) n from address.street_number sn where not exists (select 1 from address.road_address ra where ra.road_address_id = sn.street_number_id)`)).n,
  additional_information_without_road_address: +(await one(`select count(*) n from address.additional_information ai where not exists (select 1 from address.road_address ra where ra.road_address_id = ai.additional_information_id)`)).n,
};

// 2) 페이지 일관성: 모든 페이지를 모으면 총 건수와 같고, 겹치는 주소가 없는지
const term = '세종대로';
const seen = new Set();
let total = 0, pages = 0, dup = 0;
for (let page = 1; ; page++) {
  const { body } = await api(`search=${encodeURIComponent(term)}&page=${page}&limit=100`);
  total = body.pagination.totalCount;
  for (const r of body.data) { const id = r.raw.road_address.road_address_id; if (seen.has(id)) dup++; seen.add(id); }
  pages++;
  if (page >= body.pagination.totalPages) break;
}
out.paging = { term, totalCount: total, pages, collected: seen.size, duplicates: dup };

// 3) 입력 검증(typia): 범위를 벗어난 요청은 400
out.validation = {
  one_char_search: (await api(`search=${encodeURIComponent('로')}&page=1&limit=10`)).status,
  limit_101: (await api(`search=${encodeURIComponent('세종대로')}&page=1&limit=101`)).status,
  page_0: (await api(`search=${encodeURIComponent('세종대로')}&page=0&limit=10`)).status,
  ok: (await api(`search=${encodeURIComponent('세종대로')}&page=1&limit=10`)).status,
  no_match: (await api(`search=${encodeURIComponent('없는도로이름zzz')}&page=1&limit=10`)).body.pagination,
};

// 4) 알려진 주소: 도로명과 건물 번호로 찾아 건물명, 우편번호, 지번이 맞는지
const known = async (road, main, sub, province) => (await c.query(
  `select concat_ws(' ', rc.province_name, rc.district_name, rc.road_name, ra.main_building_number) addr,
          ai.postal_code, ai.sigungu_building_name, ai.administrative_district_name,
          concat_ws(' ', sn.legal_town_name, sn.land_lot_main_number || case when sn.land_lot_sub_number <> '0' then '-' || sn.land_lot_sub_number else '' end) lot
   from address.road_code rc
   join address.road_address ra on ra.road_name_code = rc.road_code_id and ra.admin_division_serial_number = rc.admin_division_serial_number
   join address.street_number sn on sn.street_number_id = ra.road_address_id and sn."representative_YN" = '1'
   join address.additional_information ai on ai.additional_information_id = ra.road_address_id
   where rc.road_name = $1 and ra.main_building_number = $2 and ra.sub_building_number = $3 and rc.province_name = $4 and ra."underground_YN" = '0'`,
  [road, main, sub, province])).rows;
out.known = {
  seoul_city_hall: await known('세종대로', '110', '0', '서울특별시'),
  sejong_city_hall: await known('한누리대로', '2130', '0', '세종특별자치시'),
  busan_city_hall: await known('중앙대로', '1001', '0', '부산광역시'),
};

fs.writeFileSync('check.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await c.end();
