import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildService } from '../../core/services/child.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Child } from '../../core/interfaces/child';
import { GameService } from '../../core/services/game.service';

interface Leaderboard {
  childId: number;
  firstName: string;
  lastName: string;
  userName: string;
  bestScore: number;
  totalGames: number;
  averageScore: number;
  level: number;
}
@Component({
  selector: 'app-leader-board',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './leader-board.component.html',
  styleUrl: './leader-board.component.scss',
})
export class LeaderBoardComponent {
  loading: boolean = true;
  error: string | null = null;
  isEmpty: boolean = false;
  leaderboard!: Leaderboard[];

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.loading = true;
    this.error = null;
    this.isEmpty = false;

    this.gameService.getGlobalLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.isEmpty = data.length === 0;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load children profiles';
        this.loading = false;
        console.error('Error loading children:', err);
      },
    });
  }

  backgroundColor(index: number): string {
    const colorArray = [
      '#fce4ec',
      '#e8eaf6',
      '#fff3e0',
      '#e8f5e8',
      '#f5f5f5',
      '#f5f5f5',
    ];

    return colorArray[Math.floor(Math.random() * colorArray.length)];
  }
}
