import { Injectable } from '@angular/core';
import {MessageService} from './message.service';
import {ServerConnectorService} from './server-connector.service';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  heroes: any;
  private wsSubscription: Subscription;
  constructor(
    private messageService: MessageService,
    private service: ServerConnectorService
  ) {
    this.wsSubscription = this.service.createObservableSocket()
      .subscribe(
        data => this.processMessage(data),
        err => console.log('error'),
        () => console.log('The observable stream is complete')
      );
    const msg = {
      action: 'getHeroes'
    };
    this.service.sendMessage(JSON.stringify(msg));
  }

  private processMessage(message: string): void {
    const messageParsed = JSON.parse(message);
    if (messageParsed.subject === 'heroesList') {
      this.heroes.push(messageParsed.content);
    }
    if (messageParsed.subject === 'newHero') {
      this.heroes.push(messageParsed.content);
    }
    if (messageParsed.subject === 'heroDeleted') {
      this.heroes.push(messageParsed.content);
    }
    console.log('processing ended');
  }
}
