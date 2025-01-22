import { INestiaConfig } from "@nestia/sdk";
import { NestFactory } from "@nestjs/core";
// import { FastifyAdapter } from "@nestjs/platform-fastify";

import { AppModule } from "./src/app/app.module";

const NESTIA_CONFIG: INestiaConfig = {
	input: async () => {
		const app = await NestFactory.create(AppModule);

		return app;
	},
	swagger: {
		openapi: "3.1",
		output: "dist/swagger.json",
		servers: [
			{
				url:
					{
						production: `https://localhost:${process.env.SERVER_PORT}`,
						development: `http://localhost:${process.env.SERVER_PORT}`,
					}[process.env.NODE_ENV!] ??
					`http://localhost:${process.env.SERVER_PORT ?? 3000}`,
				description: "Local Server",
			},
		],

		beautify: true,
	},
	clone: true,
	output: "src/api",
	distribute: "packages/api",
	propagate: true,
	e2e: "test",
};
export default NESTIA_CONFIG;
