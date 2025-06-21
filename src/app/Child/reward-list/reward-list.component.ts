import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardService } from '../../core/services/reward.service';
import { ChildService } from '../../core/services/child.service';
import { Child } from '../../core/interfaces/child';
import { Reward } from '../../core/interfaces/reward';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reward-list',
  imports: [CommonModule, MatProgressSpinner],
  templateUrl: './reward-list.component.html',
  styleUrl: './reward-list.component.scss',
})
export class RewardListComponent implements OnInit {
  rewardItems: Reward[] = [];
  child!: Child;
  parentId: number = parseInt(sessionStorage.getItem('parentId') || '');
  isLoading: boolean = false;
  childId!: number;
  colorArray = [
    '#fce4ec',
    '#e8eaf6',
    '#fff3e0',
    '#e8f5e8',
    '#f5f5f5',
    '#f5f5f5',
  ];

  constructor(
    private rewardService: RewardService,
    private childService: ChildService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.childId = parseInt(sessionStorage.getItem('childId') || '');
    this.childService.findOne(this.childId).subscribe(
      (data: Child) => {
        this.rewardItems = data.rewards.map((reward) => {
          return {
            ...reward,
            color:
              this.colorArray[
                Math.floor(Math.random() * this.colorArray.length)
              ],
          };
        });

        this.isLoading = false;
      },
      (error) => (this.isLoading = false)
    );

    this.child = JSON.parse(sessionStorage.getItem('Child') || '');
  }

  canAfford(itemPoints: number): boolean {
    return this.child.tokens >= itemPoints;
  }

  redeemReward(item: Reward): void {
    if (this.canAfford(item.price)) {
      this.rewardService
        .redeemReward({
          childId: this.child.id,
          parentId: this.parentId,
          rewardId: item.id,
        })
        .subscribe((data) => {
          console.log('reward redeemed', data);
        });
    } else if (!this.canAfford(item.price)) {
      alert('Not enough points!');
    }
  }

  goToBuyRewardList() {
    this.router.navigateByUrl('/child/redeem-reward');
  }
}
