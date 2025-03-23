import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoggingService {
  logError(error: Error): void {
    console.error("Logging Service Error:", error);
    this.sendErrorToRemoteService(error);
  }

  private sendErrorToRemoteService(error: any): void {
    console.log("Sending error data to remote service", error);
  }

  logMessage(message: string): void {
    console.log("Logging Service Message:", message);
  }
}
