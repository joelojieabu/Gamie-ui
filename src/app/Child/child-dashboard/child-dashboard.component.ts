import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ChildService } from '../../core/services/child.service';
import { Child } from '../../core/interfaces/child';
import { GameService } from '../../core/services/game.service';

interface HallOfFameItem {
  childId: number;
  firstName: string;
  lastName: string;
  userName: string;
  bestScore: number;
  totalGames: number;
  averageScore: number;
}

@Component({
  selector: 'app-child-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './child-dashboard.component.html',
  styleUrl: './child-dashboard.component.scss',
})
export class ChildDashboardComponent {
  coins = 1800;
  childId!: number;
  child!: Child;
  hallOfFameItems!: HallOfFameItem[];
  isLoading: boolean = false;

  progressItems = [
    { subject: 'Financial Basics', progress: 95, color: '#FF6B35' },
    { subject: 'Financial Basics', progress: 80, color: '#FF6B35' },
    { subject: 'Financial Basics', progress: 60, color: '#FF6B35' },
  ];

  constructor(
    private router: Router,
    private childService: ChildService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.childId = parseInt(sessionStorage.getItem('childId') || '');
    this.childService.findOne(this.childId).subscribe((data: Child) => {
      this.child = data;
      sessionStorage.setItem('Child', JSON.stringify(data));
    });

    // this.child = JSON.parse(sessionStorage.getItem('Child') || '');

    this.gameService
      .getGlobalLeaderboard()
      .subscribe((data: HallOfFameItem[]) => {
        this.hallOfFameItems = data;
      });
  }

  // Remove the old onMenuClick method since router will handle navigation
  // Replace with this method to check active routes
  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  // Optional: Method for programmatic navigation (if needed)
  navigateToRoute(route: string) {
    this.router.navigate([route]);
  }

  // Keep your existing methods
  onStartPlaying() {
    this.router.navigateByUrl('/child/games');
  }

  goToLeaderBoard() {
    this.router.navigateByUrl('/child/leaderboard');
  }

  goToRewards() {
    this.router.navigateByUrl('/child/rewards');
  }

  onAcceptChallenge() {
    console.log('Accept Challenge clicked');
  }
}
