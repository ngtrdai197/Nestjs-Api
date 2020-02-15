import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UserService } from './user.service'
import { UserController } from './user.controller'
import { USER_MODEL } from '@/common/constants'
import { UserSchema } from './schema/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_MODEL, schema: UserSchema, collection: USER_MODEL },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
