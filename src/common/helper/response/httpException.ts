import { JsonKeys } from "@/common/interface/general/general.interface";

export class HttpException extends Error {
  public status: number;
  public message: string;
  public toast: boolean;
  public data: any | {};
  public dynamicData: any;

  constructor(status: number, message: JsonKeys, data?: any, toast = true, dynamicData?: any) {
    super(message);
    this.data = data;
    this.status = status || 400;
    this.message = message;
    this.toast = toast;
    this.dynamicData = dynamicData;
  }
}
