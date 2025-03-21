import { ErrorHandler, Injectable } from '@angular/core';
import { LoggingService } from './logging-service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

 /**
   * Handles HTTP errors by logging them and returning a user-friendly error message.
   *
   * @param error The HttpErrorResponse object representing the error.
   * @returns An Observable that emits an error message.
   */
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private loggingService: LoggingService) {}

  handleError(error: any): void {
    this.loggingService.logError(error);
    console.error('An unexpected error occurred:', error);
  }

  createErrorHandler() {
    return (error: HttpErrorResponse): Observable<never> => {
      this.handleError(error); // Handle the error
      return throwError(() => new Error('An error occurred. edwdqwd')); // Return an error Observable
    };
}
}