import { PrismaService } from "../../prisma/prisma.service";
import { AddressResult, rawSearchData } from "./search.interface";
import { Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class searchService {
	constructor(private prisma: PrismaService) {}
	async searchAddress(
		search: string,
		page = 1,
		limit = 10
	): Promise<{
		results: AddressResult[];
		totalCount: number;
		currentPage: number;
		totalPages: number;
	}> {
		console.time("searchAddress");
		const offset = (page - 1) * limit;

		const pattern = `%${search}%`;
		// 1) 도로명코드(37만 행)에서 검색어에 맞는 도로와 읍면동을 고른다. 검색식은 prisma/indexes.sql 의 트라이그램 인덱스와 같아야 한다.
		// 2) 도로명코드 + 읍면동 일련번호 복합키로 주소를 잇는다. 한쪽 키만 쓰면 같은 주소가 읍면동 수만큼 중복된다.
		// 3) 전체 개수는 여기까지만 세고, 지번과 부가정보는 돌려줄 페이지의 행에만 붙인다.
		const searchQuery = Prisma.sql`
    WITH matched AS MATERIALIZED (
      SELECT
        rc.road_code_id,
        rc.admin_division_serial_number,
        rc.road_name,
        rc.road_name_roman,
        rc.town_name,
        rc.town_name_roman,
        rc.province_name,
        rc.district_name
      FROM address.road_code rc
      WHERE (COALESCE(rc.road_name, '') || ' ' || COALESCE(rc.road_name_roman, '') || ' ' ||
             COALESCE(rc.town_name, '') || ' ' || COALESCE(rc.town_name_roman, '')) LIKE ${pattern}
    ),
    hits AS (
      SELECT
        m.*,
        ra.road_address_id,
        ra."underground_YN" AS underground_yn,
        ra.main_building_number,
        ra.sub_building_number
      FROM matched m
      JOIN address.road_address ra
        ON ra.road_name_code = m.road_code_id
       AND ra.admin_division_serial_number = m.admin_division_serial_number
    ),
    cnt AS (
      SELECT COUNT(*)::text AS total_count FROM hits
    ),
    paged AS (
      SELECT * FROM hits
      ORDER BY road_address_id
      LIMIT CAST(${limit} AS INTEGER)
      OFFSET CAST(${offset} AS INTEGER)
    ),
    search_results AS (
      SELECT
        p.road_code_id,
        p.road_name,
        p.road_name_roman,
        p.town_name,
        p.town_name_roman,
        p.province_name,
        p.district_name,
        p.road_address_id,
        p.main_building_number,
        p.sub_building_number,
        sn.street_number_id,
        sn.serial_number,
        sn.legal_town_name,
        sn.legal_village_name,
        sn.land_lot_main_number,
        sn.land_lot_sub_number,
        ai.additional_information_id,
        ai.administrative_district_name,
        ai.building_registry_building_name,
        ai.sigungu_building_name,
        CONCAT_WS(' ',
          p.province_name,
          p.district_name,
          p.road_name,
          CASE p.underground_yn WHEN '1' THEN '지하' WHEN '2' THEN '공중' END,
          p.main_building_number || CASE WHEN COALESCE(p.sub_building_number, '0') <> '0' THEN '-' || p.sub_building_number ELSE '' END
        ) ||
        CASE
          WHEN COALESCE(sn.legal_town_name, '') <> '' OR COALESCE(sn.legal_village_name, '') <> ''
          THEN ' (' || CONCAT_WS(' ', sn.legal_town_name, sn.legal_village_name) || ')'
          ELSE ''
        END AS full_address,
        CONCAT_WS(' ',
          p.road_name,
          CASE p.underground_yn WHEN '1' THEN '지하' WHEN '2' THEN '공중' END,
          p.main_building_number || CASE WHEN COALESCE(p.sub_building_number, '0') <> '0' THEN '-' || p.sub_building_number ELSE '' END
        ) AS road_address_only,
        CONCAT_WS(' ',
          sn.legal_town_name,
          sn.legal_village_name,
          CASE WHEN sn."mountain_YN" = '1' THEN '산' END,
          sn.land_lot_main_number || CASE WHEN COALESCE(sn.land_lot_sub_number, '0') <> '0' THEN '-' || sn.land_lot_sub_number ELSE '' END
        ) AS jibun_address
      FROM paged p
      -- 주소마다 대표 지번은 정확히 하나다(관련 지번은 serial_number 가 이어진다)
      LEFT JOIN address.street_number sn
        ON sn.street_number_id = p.road_address_id AND sn."representative_YN" = '1'
      LEFT JOIN address.additional_information ai
        ON ai.additional_information_id = p.road_address_id
      ORDER BY p.road_address_id
    )
    SELECT (SELECT total_count FROM cnt) AS total_count,
           COALESCE(json_agg(r), '[]'::json) AS data
    FROM search_results r;
  `;
		const results: {
			total_count: string;
			data: Array<rawSearchData>;
		}[] = await this.prisma.$queryRaw(searchQuery);

		console.timeEnd("searchAddress");
		const totalCount = parseInt(results[0].total_count ?? "0");
		const totalPages = Math.ceil(totalCount / limit);

		const formattedResults: AddressResult[] = results[0].data.map(
			(result: any) => ({
				formattedAddress: result.full_address,
				raw: {
					road_code: {
						road_code_id: result.road_code_id,
						road_name: result.road_name,
						road_name_roman: result.road_name_roman,
						town_name: result.town_name,
						town_name_roman: result.town_name_roman,
						province_name: result.province_name,
						district_name: result.district_name,
					},
					road_address: {
						road_address_id: result.road_address_id,
						main_building_number: result.main_building_number,
						sub_building_number: result.sub_building_number,
					},
					street_number: {
						street_number_id: result.street_number_id,
						serial_number: result.serial_number,
						legal_town_name: result.legal_town_name,
						legal_village_name: result.legal_village_name,
						land_lot_main_number: result.land_lot_main_number,
						land_lot_sub_number: result.land_lot_sub_number,
					},
					additional_information: {
						additional_information_id:
							result.additional_information_id,
						administrative_district_name:
							result.administrative_district_name,
						building_registry_building_name:
							result.building_registry_building_name,
						sigungu_building_name: result.sigungu_building_name,
					},
				},
			})
		);

		return {
			results: formattedResults,
			totalCount,
			currentPage: page,
			totalPages,
		};
	}
}
