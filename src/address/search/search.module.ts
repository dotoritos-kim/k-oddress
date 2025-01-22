import { Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { searchService } from "./search.service";
import { searchController } from "./search.controller";

@Module({
	controllers: [searchController],
	providers: [searchService, PrismaService],
})
export class searchModule {}
