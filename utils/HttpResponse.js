export default class HttpResponse {
  constructor({
    message,
    statusCode = 200,
    success = true,
    marketStatus = undefined,
    data,
  }) {
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
    this.marketStatus = marketStatus;
    this.data = data;
  }

  toJson() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      success: this.success,
      marketStatus: this.marketStatus,
      data: this.data,
    };
  }
}
