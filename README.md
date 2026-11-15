# k-oddress

한국 도로명주소를 찾는 NestJS API. 행정안전부가 공개하는 주소DB를 PostgreSQL에 그대로 옮기고,
한국어와 로마자 도로명, 읍면동 이름으로 검색한다.

## 데이터 구조

주소DB의 네 묶음이 각각 테이블 하나다(`prisma/schema.prisma`).

| 테이블 | 원본 파일 | 키 | 건수 (2026-10) |
|---|---|---|---:|
| `address.road_code` | 개선_도로명코드_전체분 | 도로명코드(12) + 읍면동 일련번호(2) | 372,379 |
| `address.road_address` | 주소_시도 | 도로명주소 관리번호(25) | 6,426,585 |
| `address.street_number` | 지번_시도 | 관리번호 + 일련번호 | 8,198,279 |
| `address.additional_information` | 부가정보_시도 | 관리번호 | 6,426,585 |

- 주소는 도로명코드와 읍면동 일련번호 복합키로 도로명코드에 이어진다.
- 지번과 부가정보는 관리번호로 주소에 이어진다. 주소마다 대표 지번이 정확히 하나 있고, 나머지는 관련 지번이다.
- 부가정보에 행정동 코드, 우편번호, 공동주택 여부가, 지번에 법정동 코드가 있어 시도, 시군구, 동, 우편번호 단위
  집계가 조인 한두 번으로 나온다.

## 검색

`GET /address/search?search=세종대로&page=1&limit=10`

- 검색어는 2~100자, limit은 100 이하(typia로 검증).
- 도로명, 로마자 도로명, 읍면동, 로마자 읍면동의 부분 일치.
- 전체 개수와 페이지 결과를 쿼리 하나로 가져오고, 결과마다 네 테이블의 원본 키를 함께 돌려준다.
- 전국 643만 주소에서 대부분의 검색어가 2~6ms에 응답한다(`prisma/indexes.sql`의 인덱스 기준).

## 검증

공개 주소DB 전체분을 실제로 넣고 측정한 기록은 [docs/VERIFICATION.md](docs/VERIFICATION.md)에 있다.
적재, 측정, 무결성 확인, 집계 스크립트는 `verify/` 폴더에 있다.

## 실행

```bash
npm install
npx prisma generate
# .env 에 DATABASE_URL, SERVER_PORT
npx tsc && NODE_ENV=production node build/main.js
```
