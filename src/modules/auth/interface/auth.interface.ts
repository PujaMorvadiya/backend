export interface TokenDataInterface {
  email: string;
  id: string;
  user?: any;
}

export interface AuthRegisterReqInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  date_of_birth: string;
  profile_image?: string;
}

export interface LoginData {
  email: string;
  password: string;
}