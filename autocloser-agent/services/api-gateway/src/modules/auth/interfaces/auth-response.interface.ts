import { User } from '../../users/user.entity';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    phoneNumber?: string;
    avatar?: string;
    language: string;
    isEmailVerified: boolean;
    isPhoneVerified: boolean;
    merchant?: any;
  };
}