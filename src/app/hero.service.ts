import {Injectable} from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import { Hero} from './hero';
import { MessageService} from './message.service';
import { HEROES} from './mock-heroes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {ServerConnectorService} from './server-connector.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  heroes: Hero[] = [];
  private wsSubscription: Subscription;
  constructor(
    private messageService: MessageService,
    private http: HttpClient,
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

  // getHeroes(): Observable<Hero[]> {
  //   return this.http.get<Hero[]>(this.heroesUrl)
  //     .pipe(
  //       tap(_ => this.log('fetched heroes')),
  //       catchError(this.handleError<Hero[]>('getHeroes', []))
  //     );
  // }

  getHeroes(): Observable<Hero[]> {
    console.log('getting heroes...');

    return of(this.heroes);
  }

  getHero(id: string): Hero|undefined {
    // TODO: send the message _after_ fetching the hero
    this.log(`HeroService: fetched hero id=${id}`);
    return this.heroes.find(hero => hero.id === id);
  }

  saveHero(updatedHero: Hero|undefined): void {
    if (updatedHero === undefined) {
      return;
    }
    const msg = { action: 'addHero', hero: updatedHero };
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
    private processMessage(message: string): void {
      console.log('processing message...');
      const messageParsed = JSON.parse(message);
      if (messageParsed.subject === 'heroesList') {
        this.heroes = messageParsed.content;
      }
      if (messageParsed.subject === 'newHero') {
        console.log('it is a new hero!!!');
        this.heroes.push(messageParsed.content);
      }
      console.log('processing ended');
  }
}
