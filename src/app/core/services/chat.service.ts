import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private baseUrl = 'https://kiddieslearn-api-production.up.railway.app/chatbot';
  // private baseUrl = 'http://localhost:3000/chatbot';

  constructor(private http: HttpClient) {}

  sendMessage(message: string, id: number): Observable<any> {
    return this.http.post<any>(this.baseUrl, { message, id });
  }
}
