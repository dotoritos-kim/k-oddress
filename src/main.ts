import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import * as fs from "fs";
import { join } from "path";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule } from "@nestjs/swagger";
import * as dtoModels from "./dto";
import { HttpsOptions } from "@nestjs/common/interfaces/external/https-options.interface";
import { INestApplication } from "@nestjs/common";
import { NestiaSwaggerComposer } from "@nestia/sdk";
export const extraModels = Object.values(dtoModels);

export let app: INestApplication | null = null;
export const appFactory = async (httpsOptions?: HttpsOptions) => {
	const create = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "debug", "fatal", "log", "verbose"],
		httpsOptions,
	});
	app = create;
	return app;
};
async function development() {
	const httpsOptions = {
		key: fs.readFileSync(join(__dirname, "../localhost-key.pem")),
		cert: fs.readFileSync(join(__dirname, "../localhost.pem")),
	};
	let devApp;
	if (app) {
		devApp = app;
	} else {
		devApp = await appFactory(httpsOptions);
	}

	devApp.enableCors({
		origin: [
			`https://localhost:${process.env.FRONT_PORT}`,
			`http://localhost:${process.env.FRONT_PORT}`,
		],
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
		credentials: true,
	});
	const document = await NestiaSwaggerComposer.document(devApp, {});
	SwaggerModule.setup("api", devApp, document as any);
	const configService = devApp.get(ConfigService);
	const PORT = configService.get("SERVER_PORT");
	console.log("dev 서버 시작 중...");
	console.log("NODE_ENV:", process.env.NODE_ENV);
	await devApp.listen(PORT);
}

async function production() {
	//const httpsOptions = {
	//  key: fs.readFileSync(join(__dirname, '../localhost-key.pem')),
	//  cert: fs.readFileSync(join(__dirname, '../localhost.pem')),
	//};

	let prodApp;
	if (app) {
		prodApp = app;
	} else {
		prodApp = await appFactory();
	}
	//app.enableCors({
	// origin: [`https://localhost:${process.env.SERVER_PORT}`,`http://localhost:${process.env.SERVER_PORT}`],
	// credentials: true,
	//});
	const document = await NestiaSwaggerComposer.document(prodApp, {});
	SwaggerModule.setup("api", prodApp, document as any);
	const configService = prodApp.get(ConfigService);
	const PORT = configService.get("SERVER_PORT");
	console.log("prod 서버 시작 중...");
	console.log("NODE_ENV:", process.env.NODE_ENV);
	await prodApp.listen(PORT);
}

async function bootstrap() {
	switch (process.env.NODE_ENV) {
		case "production":
			await production();
			break;
		case "development":
			await development();
			break;
	}
}
bootstrap();
