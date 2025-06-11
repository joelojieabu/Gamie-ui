import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ChildService } from '../../core/services/child.service';
import { GameService } from '../../core/services/game.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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

export interface RecentActivityData {
  userName: string;
  moduleName: string;
  score: string;
  timeTaken: string;
  playedAt: string;
}

interface GameHistory {
  id: number;
  childId: number;
  name: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeTaken: number;
  playedAt: string;
}

interface ParentGameHistory {
  moduleName: string;
  score: number;
  timeTaken: number;
  playedAt: string;
  firstName: string;
  level: number;
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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild('activityChart') chartCanvas!: ElementRef;

  // Child selection
  children: Child[] = [];
  selectedChildId: number | null = null;

  // Dashboard stats
  modulesCompleted = 0;
  quizzesPassed = 0;
  inProgressModules = 0;
  minutesSpent = 0;

  // Date
  currentDate = new Date();

  // Chart
  chart: Chart | null = null;

  // Table data
  displayedColumns: string[] = [
    'moduleName',
    'score',
    'timeTaken',
    'playedAt',
    'firstName',
    'level',
  ];

  dataSource = new MatTableDataSource<ParentGameHistory>([]);
  parentId = parseInt(localStorage.getItem('parentId') || '0');

  constructor(
    private childService: ChildService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.loadChildren();
    this.updateCurrentDate();
    // this.loadRecentGames();
    this.loadParentHistory(this.parentId);
  }

  ngAfterViewInit() {
    this.createChart();
  }

  loadChildren() {
    const parentId = localStorage.getItem('parentId');
    if (parentId) {
      this.childService.findByParent(parseInt(parentId)).subscribe({
        next: (children) => {
          this.children = children;
          if (children.length > 0) {
            this.selectedChildId = children[0].id;
            this.loadChildStats(children[0].id);
            this.loadChildHistory(children[0].id);
          }
        },
        error: (error) => {
          console.error('Error loading children:', error);
        },
      });
    }
  }

  onChildSelect(childId: number) {
    this.selectedChildId = childId;
    this.loadChildStats(childId);
    this.loadChildHistory(childId);
  }

  loadChildStats(childId: number) {
    this.gameService.getChildStats(childId).subscribe({
      next: (stats) => {
        this.modulesCompleted = stats.totalGames;
        this.quizzesPassed = stats.bestScore;
        this.inProgressModules = stats.averageScore;
        this.minutesSpent = stats.averageTime;
      },
      error: (error) => {
        console.error('Error loading child stats:', error);
      },
    });
  }

  loadChildHistory(childId: number) {
    this.gameService.getChildHistory(childId).subscribe({
      next: (history: GameHistory[]) => {
        // Sort history by playedAt in ascending order
        const sortedHistory = history.sort(
          (a, b) =>
            new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
        );

        // Update chart with new data
        this.updateChart(sortedHistory);
      },
      error: (error) => {
        console.error('Error loading child history:', error);
      },
    });
  }

  loadParentHistory(parentId: number) {
    this.gameService.getParentHistory(parentId).subscribe({
      next: (history: any[]) => {
        // Sort history by playedAt in ascending order
        const sortedHistory = history.sort(
          (a, b) =>
            new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
        );

        const mappedHistory = sortedHistory.map((game) => ({
          moduleName: game.name || 'Unknown',
          score: game.score || 0,
          timeTaken: game.timeTaken,
          playedAt: game.playedAt,
          firstName: game.child.firstName,
          level: game.child.level,
        }));

        this.dataSource.data = mappedHistory;
      },
      error: (error) => {
        console.error('Error loading child game history:', error);
      },
    });
  }

  // loadRecentGames() {
  //   this.gameService.getParentHistory(this.parentId).subscribe({
  //     next: (games) => {
  //       const recentActivityData = games.map((game) => ({
  //         userName: game.child?.userName || 'Unknown',
  //         moduleName: game.name,
  //         score: game.score.toString(),
  //         timeTaken: `${game.timeTaken} minutes`,
  //         playedAt: new Date(game.playedAt).toLocaleString(),
  //       }));

  //       // this.dataSource.data = recentActivityData;
  //     },
  //     error: (error) => {
  //       console.error('Error loading recent games:', error);
  //     },
  //   });
  // }

  createChart() {
    if (this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'Score',
              data: [],
              borderColor: '#ff6b35',
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              title: {
                display: true,
                text: 'Score',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Date',
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      });
    }
  }

  updateChart(history: GameHistory[]) {
    if (this.chart) {
      const labels = history.map((game) =>
        new Date(game.playedAt).toLocaleDateString()
      );
      const scores = history.map((game) => game.score);

      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = scores;
      this.chart.update();
    }
  }

  updateCurrentDate() {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    this.currentDate = new Date();
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
