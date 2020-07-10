import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataService {
  private messageSource = new BehaviorSubject("");
  currentMessage = this.messageSource.asObservable();

  constructor() {}

  sendMessageToLogin(message: string) {
    this.messageSource.next(message);
  }
  sendMessageToRegister(message: string) {
    this.messageSource.next(message);
  }
  sendMessageToUser(message: string) {
    this.messageSource.next(message);
  }
}
