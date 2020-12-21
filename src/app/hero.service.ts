import {Injectable} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import { Hero} from './hero';
import { MessageService} from './message.service';
import { ServerConnectorService } from './server-connector.service';
import {FilterService} from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  heroes: Hero[] = [];

  constructor(
    private messageService: MessageService,
    private service: ServerConnectorService,
    private filter: FilterService
    ) {
    this.filter.heroesShared$
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

  getHeroes(): Observable<Hero[]> {
    return of(this.heroes);
  }

  getHero(id: string): Observable<Hero|undefined> {
    // TODO: send the message _after_ fetching the hero
    this.log(`HeroService: fetched hero id=${id}`);
    return of(this.heroes.find(hero => hero.id === id));
  }

  saveHero(updatedHero: Hero|undefined): void {
    if (updatedHero === undefined) {
      return;
    }
    const msg = { action: 'addHero', hero: updatedHero };
    this.service.sendMessage(JSON.stringify(msg));
  }

  deleteHero(heroToDelete: Hero|undefined): void {
    if (heroToDelete === undefined) {
      return;
    }
    const msg = { action: 'deleteHero', hero: heroToDelete};
    this.service.sendMessage(JSON.stringify(msg));
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string): void {
    this.messageService.add(`HeroService: ${message}`);
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): any{
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
    private processMessage(message: any): void {
      if (message.subject === 'heroesList') {
        this.heroes = message.content;
      }
      if (message.subject === 'newHero') {
        this.heroes.push(message.content);
      }
      if (message.subject === 'heroDeleted') {
        this.heroes = this.heroes.filter(hero => hero.id !== message.content.id);
      }
  }
}
