export interface IGenerateAuthTokens {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
}

export interface IJwtPayload{
  sub: string;
  iat: number;
  exp: number;
  type: string;
}
