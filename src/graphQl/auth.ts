import { gql } from "@apollo/client";

export const VERIFY_SESSION_TICKET = gql`
  mutation verifySessionTicket($input: VerifySessionTicketInput!) {
    verifySessionTicket(input: $input) {
      id
      authType
      userType
      username
      phoneNumber {
        code
        number
      }
      email
      refreshToken
      accessToken
      isPhoneVerified
      isEmailVerified
      profilePicture {
        cachedOriginal
        name
        id
        original
      }
      bio
      gender
      status
      displayName
      accountType
    }
  }
`;

export const CHECK_EMAIL_AVAILABILITY = gql`
  query checkEmailAvailability($email: String!) {
    checkEmailAvailability(email: $email)
  }
`;

export const CHECK_PHONE_NUMBER_AVAILABILITY = gql`
  query checkPhoneNumberAvailability($input: PhoneNumberInput!) {
    checkPhoneNumberAvailability(input: $input)
  }
`;

export const SEND_ACCOUNT_VERIFICATION_OTP = gql`
  mutation sendAccountVerificationOtp($input: SendOtpInput!) {
    sendAccountVerificationOtp(input: $input) {
      error
      data
      message
      statusCode
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      authType
      userType
      username
      phoneNumber {
        code
        number
      }
      email
    }
  }
`;

export const VERIFY_CREDENTIALS = gql`
  mutation verifyCredentials($input: VerifyCredentialsInput!) {
    verifyCredentials(input: $input) {
      error
      data {
        code
        isMigrated
      }
      message
      statusCode
    }
  }
`;

export const LOGIN = gql`
  mutation login($input: LoginDataInput!) {
    login(input: $input) {
      id
      authType
      userType
      username
      phoneNumber {
        code
        number
      }
      signupPlatform
      email
      isPublic
      refreshToken
      accessToken
      isPhoneVerified
      isEmailVerified
      dateOfBirth
      lastLogin
      deviceDetails {
        deviceType
        deviceToken
        deviceId
        deviceName
        appVersion
      }
      profilePicture {
        cachedOriginal
        name
        id
        original
      }
      bio
      gender
      status
      displayName
      lastUsernameUpdate
      interests
      postsCount
      followersCount
      followingsCount
      likesReceivedCount
      accountType
      existingUser
    }
  }
`;

export const SEND_FORGOT_PASSWORD_OTP = gql`
  mutation sendForgotPasswordOtp($input: SendOtpInput!) {
    sendForgotPasswordOtp(input: $input) {
      error
      data
      message
      statusCode
    }
  }
`;

export const VERIFY_FORGOT_PASSWORD_OTP = gql`
  mutation verifyForgotPasswordOTP($input: VerifyOTPInput!) {
    verifyForgotPasswordOTP(input: $input)
  }
`;

export const RESET_PASSWORD = gql`
  mutation resetUserPassword($input: ResetPasswordInput!) {
    resetUserPassword(input: $input) {
      id
      authType
      userType
      username
      phoneNumber {
        code
        number
      }
      signupPlatform
      email
      isPublic
      refreshToken
      accessToken
      isPhoneVerified
      isEmailVerified
      dateOfBirth
      lastLogin
      deviceDetails {
        deviceType
        deviceToken
        deviceId
        deviceName
        appVersion
      }
      profilePicture {
        cachedOriginal
        name
        id
        original
      }
      bio
      gender
      status
      displayName
      lastUsernameUpdate
      interests
      postsCount
      followersCount
      followingsCount
      likesReceivedCount
      accountType
    }
  }
`;
