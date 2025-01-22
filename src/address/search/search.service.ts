import { PrismaService } from "../../prisma/prisma.service";
import { AddressResult, rawSearchData } from "./search.interface";
import { Prisma } from "@prisma/client";
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

		// 실제 데이터 조회
		const searchQuery = Prisma.sql`
    WITH search_results AS (
      SELECT 
        rc.road_code_id,
        rc.road_name,
        rc.road_name_roman,
        rc.town_name,
        rc.town_name_roman,
        rc.province_name,
        rc.district_name,
        ra.road_address_id,
        ra.main_building_number,
        ra.sub_building_number,
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
        
        COALESCE(rc.province_name, '') || ' ' || COALESCE(rc.district_name, '') || ' ' || COALESCE(rc.road_name, '') || ' ' || 
        COALESCE(ra.main_building_number::text, '') || COALESCE('-' || ra.sub_building_number::text, '') || 
        CASE 
          WHEN COALESCE(sn.legal_town_name, '') != '' OR COALESCE(sn.legal_village_name, '') != '' 
          THEN ' (' || TRIM(COALESCE(sn.legal_town_name, '') || ' ' || COALESCE(sn.legal_village_name, '')) || ')' 
          ELSE '' 
        END AS full_address,
        (rc.road_name || ' ' || ra.main_building_number || COALESCE('-' || ra.sub_building_number, '')) AS road_address_only,
        (COALESCE(sn.legal_town_name, '') || COALESCE(' ' || sn.legal_village_name, '') || ' ' || 
         sn.land_lot_main_number || COALESCE('-' || sn.land_lot_sub_number, '')) AS jibun_address
      FROM address.road_code rc
      LEFT JOIN address.road_address ra ON rc.road_code_id = ra.road_name_code
      LEFT JOIN address.street_number sn ON ra.road_address_id = sn.street_number_id
      LEFT JOIN address.additional_information ai ON ra.road_address_id = ai.additional_information_id
      WHERE 
        (rc.road_name || ' ' || rc.road_name_roman || ' ' || rc.town_name || ' ' || rc.town_name_roman) LIKE ${`%${search}%`}
    ),
        cnt AS (
  SELECT SUM(1)::text AS total_count
  FROM search_results
),paged AS (
  SELECT * FROM search_results
    LIMIT CAST(${limit} AS INTEGER)
    OFFSET CAST(${offset} AS INTEGER)
)
    SELECT (SELECT total_count FROM cnt) AS total_count,
       json_agg(p) AS data
FROM paged p;
  `;
		const results: {
			total_count: string;
			data: Array<rawSearchData>;
		}[] = await this.prisma.$queryRaw(searchQuery);

		console.timeEnd("searchAddress");
		console.log(results);
		const totalCount =
			results[0].data.length > 0 ? parseInt(results[0].total_count) : 0;
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
