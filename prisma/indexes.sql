-- 검색에 쓰는 인덱스. Prisma 스키마로는 표현식 GIN 인덱스를 만들 수 없어 SQL 로 둔다.
-- 적재가 끝난 뒤 한 번 실행한다:  psql "$DATABASE_URL" -f prisma/indexes.sql

-- 한글 트라이그램이 동작하려면 DB 의 LC_CTYPE 이 C 가 아니어야 한다(예: ko_KR.utf8).
-- C 로케일에서는 show_trgm('세종대로') 가 빈 배열을 돌려주고 인덱스가 쓰이지 않는다.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1) 도로명, 로마자 도로명, 읍면동, 로마자 읍면동을 이은 문자열의 부분 일치 검색.
--    식은 src/address/search/search.service.ts 의 WHERE 절과 글자까지 같아야 한다.
CREATE INDEX IF NOT EXISTS road_code_search_trgm
    ON address.road_code
    USING gin ((COALESCE(road_name, '') || ' ' || COALESCE(road_name_roman, '') || ' ' ||
                COALESCE(town_name, '') || ' ' || COALESCE(town_name_roman, '')) gin_trgm_ops);

-- 2) 도로명코드 + 읍면동 일련번호로 주소를 찾는다. 관리번호까지 넣어 정렬과 개수 세기를 인덱스만으로 한다.
CREATE INDEX IF NOT EXISTS road_address_road_idx
    ON address.road_address (road_name_code, admin_division_serial_number, road_address_id);

ANALYZE address.road_code;
ANALYZE address.road_address;
