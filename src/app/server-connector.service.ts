import { Injectable } from '@angular/core';
import {Observable, timer} from 'rxjs';
import { environment } from '../environments/environment';
export const WS_ENDPOINT = environment.wsEndpoint;

@Injectable({
  providedIn: 'root'
})

export class ServerConnectorService {
  private ws: WebSocket;
  constructor() {
    this.ws = new WebSocket(environment.wsEndpoint);
  }
  createObservableSocket(): Observable<any> {
    return new Observable(
      observer => {
        this.ws.onmessage = (event) => { observer.next(event.data); };
        this.ws.onerror = (event) => {console.log('error happened websocket'); observer.error(event); };
        this.ws.onclose = (event) => { console.log('closing event: ' + JSON.stringify(event)); observer.complete(); };
        return () => this.ws.close(1000, 'The user disconnected');
      }
    );
  }
  waitForOpenConnection(): Promise<any> {
    return new Promise((resolve, reject) => {
      const maxNumberOfAttempts = 10;
      const intervalTime = 200;

      let currentAttempt = 0;
      const interval = setInterval(() => {
        if (currentAttempt > maxNumberOfAttempts - 1) {
          clearInterval(interval);
          reject(new Error('Maximum number of attempts exceeded'))
        } else if (this.ws.readyState === this.ws.OPEN) {
          clearInterval(interval);
          resolve();
        }
        currentAttempt++;
      }, intervalTime);
    });
  }
    async sendMessage(msg: string): Promise<void> {
      if (this.ws.readyState !== this.ws.OPEN) {
        try {
          await this.waitForOpenConnection();
          this.ws.send(msg);
        } catch (err) { console.error(err); }
      } else {
        this.ws.send(msg);
      }
  }
}
