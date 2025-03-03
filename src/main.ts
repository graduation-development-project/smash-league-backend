import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { loadRoleMap } from "./infrastructure/enums/role.enum";
import { loadNotificationTypeMap } from "./infrastructure/enums/notification-type.enum";
import { BadRequestException, ValidationPipe } from "@nestjs/common";

declare const module: any;

async function bootstrap() {
	await loadRoleMap();
	await loadNotificationTypeMap();
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		credentials: true
	});
	app.useGlobalPipes(
    new ValidationPipe({
      // exceptionFactory: (errors) => {
      //   const result = errors.map((error) => ({
      //     property: error.property,
      //     message: error.constraints[Object.keys(error.constraints)[0]],
      //   }));
      //   return new BadRequestException(result);
      // },
      stopAtFirstError: true,
			whitelist: false,
			transform: true
    }),
  );
	const configService = app.get(ConfigService);
	const prefix = configService.get<string>("PREFIX");
	app.setGlobalPrefix(prefix);
	await app.listen(5000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}

	const server = app.getHttpServer();
	const router = server._events.request._router;
	const availableRoutes: [] = router.stack
		.map((layer) => {
			if (layer.route) {
				return {
					route: {
						path: layer.route?.path,
						method: layer.route?.stack[0].method,
					},
				};
			}
		})
		.filter((item) => item !== undefined);
	console.log(availableRoutes);
}

bootstrap();
