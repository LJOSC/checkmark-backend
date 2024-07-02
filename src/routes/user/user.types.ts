export interface IAddUserPayload {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}
