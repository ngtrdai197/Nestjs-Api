import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { UserModule } from '@/user/user.module'
import { JwtStrategyService } from './jwt-strategy.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
  ],
  providers: [AuthService, JwtStrategyService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
