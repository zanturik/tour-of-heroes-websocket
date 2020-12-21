import { Injectable } from '@angular/core';
import {MessageService} from './message.service';
import {ServerConnectorService} from './server-connector.service';
import {Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private heroRoutes = ['heroesList', 'newHero', 'heroDeleted'];
  private messageRoutes = ['newMessage', 'heroDeleted'];

  private heroes = new Subject<string>();
  private messages = new Subject<string>();

  heroesShared$ = this.heroes.asObservable();
  messagesShared$ = this.messages.asObservable();

  constructor(
    private service: ServerConnectorService
  ) {
    this.service.createObservableSocket()
      .subscribe(
        data => this.filterMessage(data),
        err => console.log('error'),
        () => console.log('The observable stream is complete')
      );
  }

  private filterMessage(message: string): void {
    const messageParsed = JSON.parse(message);
    if (this.heroRoutes.includes(messageParsed.subject)){
      this.heroes.next(messageParsed);
    }
    if (this.messageRoutes.includes(messageParsed.subject)) {
      this.messages.next(messageParsed);
    }
  }
}
