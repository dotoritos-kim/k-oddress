import { Controller } from "@nestjs/common";
import { searchService } from "./search.service";
import { TypedQuery, TypedRoute } from "@nestia/core";
import { AddressResult, IPage, IRequest } from "./search.interface";

@Controller("address/search")
export class searchController {
	constructor(private readonly service: searchService) {}

	@TypedRoute.Get()
	public async index(
		@TypedQuery() query: IRequest
	): Promise<IPage<AddressResult>> {
		const result = await this.service.searchAddress(
			query.search ?? "",
			query.page,
			query.limit
		);
		return {
			pagination: {
				currentPage: query.page ?? 1,
				limit: query.limit ?? 100,
				totalCount: result.totalCount,
				totalPages: result.totalPages,
			},
			data: [...result.results],
		};
	}
}
