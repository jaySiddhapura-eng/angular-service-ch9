import { Component, Input} from '@angular/core';
import { LoggingService } from '../logging.service'
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [LoggingService]   // tell angular where is our service located
})
export class AccountComponent {
  @Input() account: {name: string, status: string};
  @Input() id: number;

  // provide the service as the parameter to the constructor 
  constructor(private logging:LoggingService,
               private accountService:AccountService){} 

  onSetTo(status: string) {
    //console.log('A server status changed, new status: ' + status);
    this.accountService.updateStatus(this.id, status);
    this.logging.logToConsole(status);  // use the service method like

    // the event name 'statusUpdate' has been emitted
    // this event is declared in the account service
    // and therefore it is a part of the account service can be accessed as follow
    this.accountService.statusUpdated.emit(status);
  }
}
