import { Module } from '@nestjs/common';
import { ApplicationFunction } from './usecases/application.function';

@Module({
	imports: [],
	controllers: [],
	providers: [ApplicationFunction],
	exports: [ApplicationFunction]
})
export class ApplicationModule {}
