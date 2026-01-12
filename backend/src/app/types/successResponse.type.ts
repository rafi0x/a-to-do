export class SuccessResponse {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: any | any[] | null;

  constructor(
    message: string,
    data?: any,
  ) {
    this.success = true;
    this.statusCode = 200;
    this.message = message || "Success";
    this.data = data || null;
  }
}
