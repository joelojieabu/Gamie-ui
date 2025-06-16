import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl = environment + 'chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, id: number): Observable<any> {
    return this.http.post<any>(this.baseUrl, { message, id });
  }
}
