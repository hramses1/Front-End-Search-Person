
export interface UserCreate {
  id: string;
  username: string;
  email: string;
  emailVisibility: boolean;
  password: string;
  passwordConfirm: string;
  disable: boolean;
  name: string;
  plan: string;
  number_requests: number;
  token: string;
}
