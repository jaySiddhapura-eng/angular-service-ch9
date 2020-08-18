import { Component, OnDestroy } from '@angular/core';
import { LoggingService } from '../logging.service';
import { AccountService } from '../account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
  providers: [LoggingService]   // declare the service dependency provider to the angular
})
export class NewAccountComponent {

  

  // a variable with service type
  constructor(private logy:LoggingService,
              private accountService:AccountService){
                this.accountService.statusUpdated.subscribe(
                  (status: string) => alert ('new status: ' + status)
                );
              }

  onCreateAccount(accountName: string, accountStatus: string) {
    this.accountService.addAccount(accountName,accountStatus);

    //console.log('A server status changed, new status: ' + accountStatus);
    this.logy.logToConsole(accountStatus);  // access the method by using the variable name
    // which was declared in the constructor of this class
  }
}
