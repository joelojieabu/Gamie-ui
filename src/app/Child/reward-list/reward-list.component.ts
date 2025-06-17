import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardService } from '../../core/services/reward.service';
import { ChildService } from '../../core/services/child.service';
import { Child } from '../../core/interfaces/child';
import { Reward } from '../../core/interfaces/reward';

// interface RewardItem {
//   id: number;
//   name: string;
//   description: string;
//   price: number;
//   icon: string;
// }

@Component({
  selector: 'app-reward-list',
  imports: [CommonModule],
  templateUrl: './reward-list.component.html',
  styleUrl: './reward-list.component.scss',
})
export class RewardListComponent implements OnInit {
  rewardItems: Reward[] = [];
  child!: Child;
  parentId: number = parseInt(sessionStorage.getItem('parentId') || '');

  constructor(
    private rewardService: RewardService,
    private childService: ChildService
  ) {}

  ngOnInit(): void {
    this.rewardService.findAll().subscribe((data) => {
      this.rewardItems = data;
    });

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
