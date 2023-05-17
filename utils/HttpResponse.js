export default class HttpResponse {
  constructor({ message, statusCode = 200, success = true, data }) {
    this.message = message;
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;
  }

  toJson() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      success: this.success,
      data: this.data,
    };
  }
}
