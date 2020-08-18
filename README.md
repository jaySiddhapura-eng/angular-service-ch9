# Services and Dependency  Injection

## Introduction: Services

1. A common piece of code which is used by multiple components without copying or replacing the code
2. Safe analogy, Similar to the ISR (interrupt service routine) in embedded systems domain
3. Results into much cleaner implementation of the app

## Creating a service

1. Service does not need any decorator unless if other service are injected into the newly created service

2. In case if another service is added into the newly created service, ```@Injectable()``` decorator should be added to the service which will receive the injection. [decorator on the destination service]

3. Service is simply a class with methods in it, just like component

4. Service does not have any html template or CSS style sheet

5. The method of service can be used by any components by simply creating an instance of service.

6. Although manually creating the service instance is not a good practice

7. Rather best practice is to ask angular to provide the service instance, as  angular maintain the service instances more efficiently 

   ~~~typescript
   // sample service
   export class LoggingService{ 
       serviceVariable;
       
       serviceMethod(){
           // method logic
       }
   }
   ~~~

## Injecting service into the component

1. Add providers array in ```@Component``` in ```app.module.ts``` file

   ~~~typescript
   // name of sample service : LoggingSeervice
   
   import {LoggingService} from './logging.service';
   
   @NgModule({
        providers: [LoggingService]
   })
   export class AppModule { }
   ~~~

2. Another way of providing the service

   ~~~typescript
   // dont need to modify the app.module.ts file at all
   // instead modify the @Injectable decorator of service
   
   @Injectable({
       providedIn:"root"		// this service is provided at root level
   })
   export class LoggingService{ 
       serviceVariable;
       
       serviceMethod(){
           // method logic
       }
   }
   ~~~

3. On the target component where service needed 

   ~~~typescript
   // sample component : new-account.component.ts
   export class NewAccountComponent implements OnInit{ 
       
       // inject the service like this in constructor
       constructor(private injectedService : LogginService){}
       
       // accessing the service as follow
     	ngOnInit(){
           this.injectedService.serviceMethod(); // calling service method
           let importedVar = this.injectedService.serviceVariable;	// obtaining the service var
       }
   }
   ~~~

## Hierarchical Injector

1. When service is provided at some component then Angular know how to create an instance if that service

2. The single copy of the service instance by default supplied to 

   1. The component where service is provided
   2. The child component of the component where service is provided
   3. Also child of child component 
   4. This service instance will not be provided to the parent component of the component where service is provided

3. Example:

   1. **AppModule**: If service is provided at ```AppModule```, then one common service instance will be available app wide, Means this instance will be given to all the component of the app as well as all the services of that app
   2. **AppComponent**: If service is provided at ```AppComponent``` , then one common service instance will be available for all the components of the app, but this service instance will not be available for other services, Means you can not inject service A into service B if service A is provided at ```AppComponent``` level and not at ```AppModule``` level
   3. **Component**: The one common service instance will be available at the component where service is provided, and at all the child components of the component where service is provided

4. A new instance of service can be obtained at any component level by using ```provider``` keyword in the ```@Component``` decorator, example as follow

   ~~~typescript
   // we want a brand new instance of LoggingService in our component
   @Component({
     selector: 'app-comp',
     templateUrl: './app-comp.component.html',
     styleUrls: ['./app-comp.component.css'],
     providers: [AccountService]		// brand new instance provided for this instance
   })
   export class AppComp implements OnInit{
       constructor(private logSer : LoggingService){}
       
       ngOnInit(){
           this.logSer.serviceMethod();
       }
   }
   
   // the instance of this service will be available at all the child components of this component
   // although if we provide the instance again in child component then this instance will be overide 
   // at the child component by instance provided at child component
   ~~~

## Provide service in a service

1. Consider there are two services

   1. **Service A**
   2. **Service B**

2. Inject **Service B** into **Service A**

3. Add ```@Injectable``` decorator to the receiving service which is **Service  A**

4. ```@Injectable``` decorator should be **added on the service in which** you want to inject the other service

5. Best practice: It is  recommended to add ```@Injectable``` decorator to every service which you creates, even though you are not injecting any other services in that service

6. Procedure to do injection of service into another service 

   1. Provide service B at the ```app.module.ts```
   2. This can be achieve by adding provider in ```app.Module.ts```
   3. As we know from the previous section, that ```app.module.ts``` highest in the app hierarchy, and therefore if we provide **service B** at ```app.module.ts``` then the instance of service B will be available app wide. Which means that this
   4. make receiving service [Service A] available for injection by adding ```@Injectable``` tag to the service
   5. Add reference of Service B in the constructor of Service A
   6. Now all the public methods and property of Service B is available at Service A
   7. In newer version of Angular, provision of service can be mentioned in service itself
   8. Add ```@Injectable``` in Service B, and use ```providedIn : 'root'``` property in this decorator

7. Method 1: using ```providedIn``` property in service B

   ~~~typescript
   // Service B 
   @Injectable({
       providedIn:'root' 		// now this service is provided application wide
   })
   export class ServiceB{
       propertyOfServiceB ;
       methodOfServiceB(){}
   }
   ~~~

   ~~~typescript
   // Service A [target service]
   @Injectable()
   export class ServiceA implements OnInit{
       
       constructor(private serB : ServiceB){}
       
       ngOnInit(){
           this.serB.propertyOfServiceB;
           this.serB.methodOfServiceB();
       }
   }
   ~~~

8. Method 2: using ```provider``` in ```app.module.ts```

   ~~~typescript
   // app.module.ts
   @NgModule({ 
   	providers: [ServiceB]
   })
   // in this case no need to use providedIn property in Service B
   // apart from that Service A and Service B will be same as method 1
   ~~~

## Component to Component Communication using Service

1. Declare event emitter in service, which will be eventually used to transfer data between component which has instance of this service

2. Example:

   1. Service: ```account.service.ts``` implements ```EventEmitter```
   2. Component 1: ```account.component.ts``` emits the data using above Service ```EventEmitter```
   3. Component 2: ```new-account.component.ts``` subscribe to the Service ```EventEmitter```
   4. Component 1 sends the data and Component 2 receives the data 
   5. and ```EventEmitter``` of the service will act as a medium of this component communication

3. Implement ```EventEmitter``` in Service

   ~~~typescript
   // account.service.ts
   import {AppComponent} from "src/app/app.component";
   
   @Injectable({
       providedIn: AppComponent
   })
   export class AccountService{ 
       statusUpdated = new EventEmitter<string>();
   }
   
   // name of the event emitter : statusUpdated
   // data which will be flow through this event emitter : string
   ~~~

4. Emit the data on above implemented event emitter from Component 1

   ~~~typescript
   //account.component.ts
   @Component({
     selector: 'app-account',
     templateUrl: './account.component.html',
     styleUrls: ['./account.component.css'],
   })
   export class AccountComponent { 
       constructor(private accSer : AccountService){}
       
       method1(status : string){
           this.accSer.statusUpdated.emit(status);
           // status data is emitted from this component using event emitter of service
       }
   }
   ~~~

5. Subscribe to the event emitter of service from Component 2

   ~~~typescript
   // new-account.component.ts
   @Component({
     selector: 'app-new-account',
     templateUrl: './new-account.component.html',
     styleUrls: ['./new-account.component.css'],
   })
   export class NewAccountComponent implements OnInit, OnDestroy {
       localVar : string;
       serviceSub : Subscription;
       
       constructor(accountSer : AccountService){}
       
       ngOnInit(){
           this.serviceSub = this.accountSer.statusUpdated.subscribe(
           				(receivedData : string) => {
               				this.localVar = receiveData;
           					});
       }
       
       ngOnDestroy(){
           this.serviceSub.unsubscribe();
       }
   }
   
   // subscription is saved in separate property, because then we can unsubscribe the event when this 
   // component get destroyed [safe unsubscribe]
   ~~~

   