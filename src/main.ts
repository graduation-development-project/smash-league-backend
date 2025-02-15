import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';


declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prefix = configService.get<string>('PREFIX');
  app.setGlobalPrefix(prefix);
	await app.listen(5000);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}

	const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: [] = router.stack
    .map(layer => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter(item => item !== undefined);
  console.log(availableRoutes);
}
bootstrap();
