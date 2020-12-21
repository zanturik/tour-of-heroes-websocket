import { Injectable } from '@angular/core';
import {MessageService} from './message.service';
import {ServerConnectorService} from './server-connector.service';
import {Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private heroRoutes = ['heroesList', 'newHero', 'heroDeleted'];
  private heroes = new Subject<string>();

  heroesShared$ = this.heroes.asObservable();

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
  }

  private processMessage(message: string): void {
    const messageParsed = JSON.parse(message);
    if (this.heroRoutes.includes(messageParsed.subject)){
      this.heroes.next(messageParsed);
    }
  }
}
