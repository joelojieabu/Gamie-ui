import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Child } from '../interfaces/child';
import { environment } from '../environments/environment';

interface CreateChildDTO {
  parentId: number;
  firstName: string;
  lastName: string;
  userName: string;
  dateOfBirth: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  private baseUrl = environment + 'child';

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
    this.routeChildId.next(id);
  }

  getRouteChildId(): Observable<number> {
    return this.routeChildId.asObservable();
  }
}
