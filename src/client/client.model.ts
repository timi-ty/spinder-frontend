export const STATUS_OK = "ok";
export const STATUS_ERROR = "error";

export interface SpinderResponse<T> {
  status: string;
  data: T;
}

export class SpinderErrorResponse implements SpinderResponse<Error> {
  status: string;
  code: string;
  data: Error;

  constructor(code: string, data: string) {
    this.status = STATUS_ERROR;
    this.code = code;
    this.data = new Error(data);
  }
}

export interface FinalizeLoginData {
  customToken: string;
}

export class FinalizeLoginResponse
  implements SpinderResponse<FinalizeLoginData>
{
  status: string;
  data: FinalizeLoginData;

  constructor(status: string, data: FinalizeLoginData) {
    this.status = status;
    this.data = data;
  }
}
