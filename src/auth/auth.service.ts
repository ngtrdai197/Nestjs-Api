import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '@/user/user.service'
import { IUser } from '@/user/interface/user.interface'
import { LoginDto } from './dto/login.dto'
import { IValidatePayload } from './interface/validate-payload.interface'
import { CreateUserDto } from '@/user/dto/create-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(validate: IValidatePayload): Promise<IUser> {
    const { id, fullName } = validate
    const user = await this.userService.findOne({ _id: id, fullName })
    if (!user) {
      throw new HttpException('Unauthorization', HttpStatus.UNAUTHORIZED)
    }
    return user
  }

  async signUp(newUser: CreateUserDto): Promise<IUser> {
    const exist = await this.userService.findOne({ username: newUser.username })
    if (exist) {
      throw new BadRequestException('User already exists')
    }
    return await this.userService.create(newUser)
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne({ username: loginDto.username })
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    if (user.password !== loginDto.password) {
      throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST)
    }
    const { id, fullName } = user
    const payload: IValidatePayload = {
      id,
      fullName,
    }
    const token = this.createToken(payload)
    return { accessToken: token }
  }

  private createToken = (payload: IValidatePayload): string => {
    return this.jwtService.sign(payload)
  }
}
