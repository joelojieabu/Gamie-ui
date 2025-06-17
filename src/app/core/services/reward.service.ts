import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Reward } from '../interfaces/reward';

interface RedeemDTO {
  childId: number;
  parentId: number;
  rewardId: number;
}


@Injectable({
  providedIn: 'root',
})
export class RewardService {
  private baseUrl = environment + 'reward';

  constructor(private http: HttpClient) {}

  redeemReward(data: RedeemDTO): Observable<any> {
    return this.http.post<RedeemDTO>(this.baseUrl + 'purchase', data);
  }

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
