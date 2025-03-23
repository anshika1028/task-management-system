import { logger } from "../logger";

class ApiError extends Error {
  status: string;
  message: string;
  constructor(status: number, message?: string, error?: Error) {
    const fullMsg = message ? message : status?.toString();
    super(fullMsg);
    this.name = status?.toString();
    this.status = status?.toString();
    this.message = fullMsg;
    logger.error(`❌ Error: ${status} - ${fullMsg}`, error);
  }

  toString() {
    return this.message;
  }
}

export default ApiError;
