import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface GameSession {
  childId: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  name: string;
}

interface ChildStats {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
  averageTime: number;
}

interface ParentStats {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  averageAccuracy: number;
  averageTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  // private baseUrl =
  //   'https://kiddieslearn-api-production.up.railway.app/gameSession';

  private baseUrl = environment + 'gameSession';

  constructor(private http: HttpClient) {}

  submitGameSession(session: GameSession): Observable<any> {
    return this.http.post(`${this.baseUrl}/submit`, session);
  }

  getChildHistory(childId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/child/${childId}/history`);
  }

  getChildStats(childId: number): Observable<ChildStats> {
    return this.http.get<ChildStats>(`${this.baseUrl}/child/${childId}/stats`);
  }

  getParentStats(parentId: number): Observable<ParentStats> {
    return this.http.get<ParentStats>(
      `${this.baseUrl}/parent/${parentId}/stats`
    );
  }

  getParentHistory(parentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/parent/${parentId}/history`);
  }

  getParentLeaderboard(parentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/parent/${parentId}/leaderboard`
    );
  }

  getGlobalLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/leaderboard`);
  }

  getRecentGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recent`);
  }
}
