import { Injectable, EventEmitter } from "@angular/core";
import {LoggingService} from "./logging.service"

@Injectable()
export class AccountService{

    accounts = [
        {
          name: 'Master Account',
          status: 'active'
        },
        {
          name: 'Testaccount',  
          status: 'inactive'
        },
        {
          name: 'Hidden Account',
          status: 'unknown'
        }
      ];

      // following event emitter helps communicate two component
      // this event will be emitted from the account component
      // although this eventemitter is declared here in account service
      statusUpdated = new EventEmitter<string>();

      // we are injecting logging service into account-service
      constructor(private logService:LoggingService){}
    
      addAccount(name: string, status:string){
        this.accounts.push({name:name,status:status});
        this.logService.logToConsole(status);
      }

      updateStatus(id:number,status:string){
        this.accounts[id].status = status;
       }

}