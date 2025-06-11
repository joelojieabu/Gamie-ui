import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface CreateChildDTO {
  parentId: number;
  firstName: string;
  lastName: string;
  userName: string;
  dateOfBirth: string;
}

interface Child {
  id: number;
  parentId: number;
  firstName: string;
  lastName: string;
  userName: string;
  dateOfBirth: string;
  isActive: boolean;
  createdAt: string;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  // private baseUrl = 'https://kiddieslearn-api-production.up.railway.app/child';
  private baseUrl = 'http://localhost:3000/child';

  routeChildId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  createChild(childData: CreateChildDTO): Observable<Child> {
    return this.http.post<Child>(this.baseUrl, childData);
  }

  findByParent(parentId: number): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.baseUrl}?parentId=${parentId}`);
  }

  findOne(id: number): Observable<Child> {
    return this.http.get<Child>(`${this.baseUrl}/${id}`);
  }

  update(id: number, childData: Partial<Child>): Observable<Child> {
    return this.http.patch<Child>(`${this.baseUrl}/${id}`, childData);
  }

  deactivate(id: number): Observable<Child> {
    return this.http.put<Child>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  activate(id: number): Observable<Child> {
    return this.http.put<Child>(`${this.baseUrl}/${id}/activate`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getAll(): Observable<Child[]> {
    return this.http.get<Child[]>(`${this.baseUrl}/all`);
  }

  setRouteChildId(id: number) {
    console.log('id:', id);
    this.routeChildId.next(id);
  }

  getRouteChildId(): Observable<number> {
    return this.routeChildId.asObservable();
  }
}
