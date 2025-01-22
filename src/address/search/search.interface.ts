import { tags } from "typia";

export interface IPage<T> {
	data: T[];
	pagination: IPagination;
}
/**
 * Page request data
 */
export interface IRequest {
	search?: string & tags.MinLength<2> & tags.MaxLength<100>;
	page?: number & tags.Type<"uint32"> & tags.Minimum<1>;
	limit?: number & tags.Type<"uint32"> & tags.Minimum<1> & tags.Maximum<100>;
}
/**
 * Page information.
 */
export interface IPagination {
	currentPage: number & tags.Type<"uint32">;
	limit: number & tags.Type<"uint32">;
	totalPages: number & tags.Type<"uint32">;
	totalCount: number & tags.Type<"uint32">;
}
export interface RoadCode {
	road_code_id: string;
	road_name?: string;
	road_name_roman?: string;
	town_name?: string;
	town_name_roman?: string;
	province_name?: string;
	district_name?: string;
}

export interface RoadAddress {
	road_address_id: string;
	main_building_number?: string;
	sub_building_number?: string;
}

export interface StreetNumber {
	street_number_id: string;
	serial_number?: string;
	legal_town_name?: string;
	legal_village_name?: string;
	land_lot_main_number?: string;
	land_lot_sub_number?: string;
}

export interface AdditionalInformation {
	additional_information_id: string;
	administrative_district_name?: string;
	building_registry_building_name?: string;
	sigungu_building_name?: string;
}

export interface AddressResult {
	formattedAddress: string;
	raw: {
		road_code: RoadCode;
		road_address: RoadAddress;
		street_number: StreetNumber;
		additional_information: AdditionalInformation;
	};
}

export interface AddressResponse {
	results: AddressResult[];
	totalCount: number;
	currentPage: number;
	totalPages: number;
}

export interface rawSearchData {
	road_code_id: string;
	road_name: string | null;
	road_name_roman: string | null;
	town_name: string | null;
	town_name_roman: string | null;
	province_name: string | null;
	district_name: string | null;
	road_address_id: string;
	main_building_number: number | null;
	sub_building_number: number | null;
	street_number_id: string | null;
	serial_number: number | null;
	legal_town_name: string | null;
	legal_village_name: string | null;
	land_lot_main_number: number | null;
	land_lot_sub_number: number | null;
	additional_information_id: string | null;
	administrative_district_name: string | null;
	building_registry_building_name: string | null;
	sigungu_building_name: string | null;
	full_address: string | null;
	road_address_only: string | null;
	jibun_address: string | null;
}
