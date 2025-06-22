import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameService, GameSession } from '../../core/services/game.service';

interface Bill {
  id: number;
  value: number;
  name: string;
  color: string;
  imageUrl: string;
}

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-bill-identification',
  imports: [CommonModule, RouterModule],
  templateUrl: './bill-identification.component.html',
  styleUrl: './bill-identification.component.scss',
})
export class BillIdentificationComponent implements OnInit, OnDestroy {
  currentBill: Bill | null = null;
  options: Bill[] = [];
  score = 0;
  feedback: Feedback | null = null;
  gameActive = true;
  timeLeft = 30;
  level = 1;
  timerInterval: any;
  childId: number = parseInt(sessionStorage.getItem('childId') || '');
  totalQuestions: number = 0;

  bills: Bill[] = [
    {
      id: 1,
      value: 100,
      name: 'N100 Bill',
      color: 'white',
      imageUrl: '/100naira.jpg',
    },
    {
      id: 2,
      value: 200,
      name: 'N200 Bill',
      color: 'white',
      imageUrl: '/200naira.jpg',
    },
    {
      id: 3,
      value: 500,
      name: 'N500 Bill',
      color: 'white',
      imageUrl: '/500naira.jpg',
    },
    {
      id: 4,
      value: 1000,
      name: 'N1000 Bill',
      color: 'white',
      imageUrl: '/1000naira.jpg',
    },
    {
      id: 5,
      value: 50,
      name: 'N50 Bill',
      color: 'white',
      imageUrl: '/50naira.jpg',
    },
  ];
  constructor(private router: Router, private gameService: GameService) {}
  navigateToDashboard(): void {
    // Navigate to dashboard route
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.startNewRound();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.submitGameSession();
        clearInterval(this.timerInterval);
        this.gameActive = false;
      }
    }, 1000);
  }

  startNewRound(): void {
    // Pick a random bill for this round
    const randomBillIndex = Math.floor(Math.random() * this.bills.length);
    this.currentBill = this.bills[randomBillIndex];

    // Create answer options (one correct, others random)
    let gameOptions = [this.currentBill];

    while (gameOptions.length < 4) {
      const randomOption =
        this.bills[Math.floor(Math.random() * this.bills.length)];
      // Make sure we don't add duplicates
      if (!gameOptions.some((option) => option.id === randomOption.id)) {
        gameOptions.push(randomOption);
      }
    }

    // Shuffle the options
    this.options = this.shuffleArray(gameOptions);

    // Clear any previous feedback
    this.feedback = null;
  }

  shuffleArray(array: any[]): any[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  handleSelection(selectedOption: Bill): void {
    this.totalQuestions++;
    if (!this.gameActive || !this.currentBill) return;

    const isCorrect = selectedOption.id === this.currentBill.id;

    if (isCorrect) {
      this.feedback = {
        type: 'success',
        message: `Correct! That's a ${this.currentBill.name}!`,
      };
      this.score += 1;

      // Start a new round after a brief delay
      setTimeout(() => {
        this.startNewRound();
      }, 1000);
    } else {
      this.feedback = {
        type: 'error',
        message: `Oops! That's a ${selectedOption.name}. Try again!`,
      };
    }
  }

  resetGame(): void {
    this.score = 0;
    this.timeLeft = 60;
    this.gameActive = true;
    this.startNewRound();

    // Clear existing timer and start a new one
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.startTimer();
  }

  submitGameSession(): void {
    const data: GameSession = {
      childId: this.childId,
      score: this.score,
      correctAnswers: this.score,
      totalQuestions: this.totalQuestions,
      timeTaken: 60,
      name: 'Bill Identification',
    };

    this.gameService
      .submitGameSession(data)
      .subscribe((data) => console.log(data));
  }
}
