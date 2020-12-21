import { Injectable } from '@angular/core';
import {FilterService} from './filter.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];
  constructor(private filter: FilterService) {
    this.filter.heroesShared$
      .subscribe(
        data => this.processMessage(data),
        err => console.log('error'),
        () => console.log('The observable stream is complete')
      );
  }
  add(message: string): void {
    this.messages.push(message);
  }
  clear(): void {
    this.messages = [];
  }

  private processMessage(message: any): void {
    if (message.subject === 'newMessage') {
      this.messages.push(message.content);
    }
    if (message.subject === 'heroDeleted') {
      this.messages.push('They killed Kenny!!!!');
    }
  }
}
