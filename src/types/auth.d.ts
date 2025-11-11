export interface VerifySessionTicket {
  id: string;
  authType: string;
  userType: string;
  username: string;
  email: string;
  refreshToken: string;
  accessToken: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  bio: string;
  gender: string;
  status: string;
  displayName: string;
  accountType: string;
}

export interface VerifyCredentialsInput {
  email?: string;
  phoneNumber?: PhoneNumberInput;
  password: string;
}

export interface LoginDataInput {
  email?: string;
  phoneNumber?: PhoneNumberInput;
  password: string;
  code: number;
}

export interface LoginResponse {
  id: string;
  authType: string;
  userType: string;
  username: string;
  phoneNumber: PhoneNumberInput;
  signupPlatform: string;
  email: string;
  deviceDetails: DeviceDetailsInput;
  profilePicture: ProfilePictureInput;
  bio: string;
  gender: string;
  status: string;
  displayName: string;
  lastUsernameUpdate: string;
  interests: string[];
  postsCount: number;
  followersCount: number;
  followingsCount: number;
  likesReceivedCount: number;
  accountType: string;
  existingUser: boolean;
}

export interface ProfilePictureInput {
  cachedOriginal: string;
  name: string;
  id: string;
  original: string;
}

export interface PhoneNumberInput {
  code: string;
  number: string;
}

export interface SendOtpInput {
  email?: string;
  phoneNumber?: PhoneNumberInput;
}

export interface VerifyOTPInput {
  email?: string;
  phoneNumber?: PhoneNumberInput;
  code: number;
}

export interface ResetPasswordInput {
  email?: string;
  phoneNumber?: PhoneNumberInput;
  password: string;
  verificationCode: number;
}

export interface SendAccountVerificationOTPResponse {
  error: boolean;
  data: string;
  message: string;
  statusCode: number;
}

export interface VerifyCredentialsResponse {
  error: boolean;
  data: {
    code: string;
    isMigrated: boolean;
  };
  message: string;
  statusCode: number;
}

export interface CreateUserInput {
  email?: string;
  phoneNumber?: PhoneNumberInput;
  accountType: string;
  otp: number;
  password: string;
  signupPlatform: "Web";
  deviceDetails: DeviceDetailsInput;
  // locationData: LocationDataInput;
}
export interface DeviceDetailsInput {
  appVersion: string;
  deviceName: string;
  deviceId: string;
  deviceToken: string;
  deviceType: string;
}
export interface LocationDataInput {
  latitude: number;
  longitude: number;
}

export interface CreateUserResponse {
  id: string;
  authType: string;
  userType: string;
  username: string;
  phoneNumber: PhoneNumberInput;
  email: string;
}

export interface Country {
  country: string;
  countryCode: string;
  flag: string;
}
