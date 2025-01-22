import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller()
export class AppController {
	constructor(private readonly prisma: PrismaService) {}

	@Get("ping")
	ping() {
		return { message: "pong" };
	}

	@Get("status")
	async status() {
		try {
			await this.prisma.$queryRaw`SELECT 1`;
			return { status: "ok" };
		} catch (error) {
			return { status: "error", error: (error as Error).message };
		}
	}
}
