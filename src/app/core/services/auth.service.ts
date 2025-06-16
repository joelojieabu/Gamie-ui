import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface RegisterDTO {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  country: string;
}

interface LoginDTO {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment + 'auth';

  constructor(private http: HttpClient) {}

  register(userData: RegisterDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(credentials: LoginDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
}
