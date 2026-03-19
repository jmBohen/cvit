import { IsNotEmpty, IsStrongPassword } from 'class-validator';
export class ChangePasswordUserDto {
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  newPassword1: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is not strong enough' },
  )
  newPassword2: string;
}
