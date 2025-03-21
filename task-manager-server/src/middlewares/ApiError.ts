class ApiError extends Error {
  status: string;
  message: string;
  constructor(status: number, message?: string) {
    const fullMsg = message
      ? message
      : status?.toString();
    super(fullMsg);
    this.name = status?.toString();
    this.status = status?.toString();
    this.message = fullMsg;
  }

  toString() {
    return this.message;
  }
}

export default ApiError;
