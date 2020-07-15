import { Injectable } from "@angular/core";

@Injectable()
export class LoggingService {

  // helper method 
  // its just normal method which any class can have

  logToConsole(status:string){
    console.log('logging service message: ' + status);
  }
}
