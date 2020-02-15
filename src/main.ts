import { NestFactory, NestApplication } from '@nestjs/core'

import { AppModule } from './app.module'
import { HttpExceptionsFilter } from './common/filters/http-exception.filter'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule)
  app.enableCors()

  app.setGlobalPrefix('/v1/api')
  app.useGlobalFilters(new HttpExceptionsFilter())

  const configService = app.get(ConfigService)

  await app.listen(+configService.get('PORT'), () => {
    console.log(`Server started at port: ${configService.get('PORT')} 🚀🚀🚀`)
  })
}
bootstrap()
