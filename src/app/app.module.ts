import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PrismaService } from "../prisma/prisma.service";
import { searchModule } from "../address/search/search.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		searchModule,
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === "production"
					? ".env"
					: process.env.NODE_ENV === "development"
						? ".env"
						: ".env",
			isGlobal: true,
		}),
	],
	controllers: [AppController],
	providers: [PrismaService],
})
export class AppModule {}
