import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardService } from '../../core/services/reward.service';
import { ChildService } from '../../core/services/child.service';
import { Child } from '../../core/interfaces/child';
import { Reward } from '../../core/interfaces/reward';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redeem-reward',
  imports: [CommonModule, MatProgressSpinner],
  templateUrl: './redeem-reward.component.html',
  styleUrl: './redeem-reward.component.scss',
})
export class RedeemRewardComponent {
  rewardItems: Reward[] = [];
  child!: Child;
  parentId: number = parseInt(sessionStorage.getItem('parentId') || '');
  isLoading: boolean = false;
  childId!: number;
  childRewardIds!: Array<number>;

  constructor(
    private rewardService: RewardService,
    private childService: ChildService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.childId = parseInt(sessionStorage.getItem('childId') || '');
    this.childService.findOne(this.childId).subscribe(
      (data: Child) => {
        this.childRewardIds = data.rewards.map((x) => x.id);
        console.log("Child Reward Id's:", this.childRewardIds);
        this.rewardService.findAll().subscribe(
          (data) => {
            const rewards = data;
            console.log('rewards: ', rewards);
            this.rewardItems = rewards.filter(
              (reward) => !this.childRewardIds.includes(reward.id)
            );
            // this.rewardItems = data;
            this.isLoading = false;
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
          }
        );
      },
      (error) => (this.isLoading = false)
    );

    this.child = JSON.parse(sessionStorage.getItem('Child') || '');
  }

  canAfford(itemPoints: number): boolean {
    return this.child.tokens >= itemPoints;
  }

  redeemReward(item: Reward): void {
    this.isLoading = true;
    if (this.canAfford(item.price)) {
      this.rewardService
        .redeemReward({
          childId: this.child.id,
          parentId: this.parentId,
          rewardId: item.id,
        })
        .subscribe(
          (data) => {
            this.isLoading = false;
            this.snackBar.open(
              'You did it 🎉. Go tell you parents about your exiting new reward! 🥳',
              'Close',
              {
                duration: 3500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['my-custom-snackbar'],
              }
            );
            this.rewardItems = this.rewardItems.filter(
              (reward) => reward.id !== item.id
            );
          },
          (error) => {
            this.snackBar.open(
              "It's not you, it's us. Please try again",
              'Close',
              {
                duration: 3500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['my-custom-snackbar'],
              }
            );
          }
        );
    } else if (!this.canAfford(item.price)) {
      alert('Not enough points!');
    }
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

  goToBuyRewardList() {}
}
