import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetOtpDto } from './dto/get-otp.dto';
import { ConfirmOtpDto } from './dto/confirm-otp.dto';
import { CurrentUser, NoCache } from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { GetUserDto } from './users/dto/get-user.dto';
import { Serialize } from './users/interceptors/serialize.interceptor';
import { EditInfoDto } from './dto/edit-info.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './libs';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetOtpResponseDto } from './dto/get-otp.response.dto';

@NoCache()
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => GetOtpResponseDto, { name: 'otp' })
  async getOtp(@Args('getOtpDto') getOtpDto: GetOtpDto) {
    return this.authService.getOtp(getOtpDto);
  }

  @Mutation(() => GetUserDto, { name: 'confirm' })
  @Serialize(GetUserDto)
  async confirmOtp(
    @Args('confirmOtpDto') confirmOtpDto: ConfirmOtpDto,
    @Context() context: any,
  ) {
    const { res } = context;

    return this.authService.confirmOtp(confirmOtpDto, res);
  }

  @Mutation(() => GetUserDto, { name: 'changePassowrd' })
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  async changePassowrd(
    @CurrentUser() user: User,
    @Args('changePasswordDto') changePasswordDto: ChangePasswordDto,
    @Context() context: any,
  ) {
    const { res } = context;

    return this.authService.changePassword(changePasswordDto, res, user);
  }

  @Mutation(() => GetUserDto, { name: 'login' })
  @Serialize(GetUserDto)
  async login(@Args('loginDto') loginDto: LoginDto, @Context() context: any) {
    const { res } = context;

    return this.authService.login(loginDto, res);
  }

  @Mutation(() => GetUserDto, { name: 'logout', nullable: true })
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any) {
    const { res } = context;

    this.authService.logout(res);
  }

  @Query(() => GetUserDto, { name: 'info' })
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => GetUserDto, { name: 'info' })
  @UseGuards(JwtAuthGuard)
  @Serialize(GetUserDto)
  async editInfo(
    @CurrentUser() user: User,
    @Args('editInfoDto') editInfoDto: EditInfoDto,
  ) {
    return this.authService.editInfo(editInfoDto, user);
  }
}
