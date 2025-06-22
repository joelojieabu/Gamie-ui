import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameService, GameSession } from '../../core/services/game.service';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  category: 'saving' | 'spending' | 'earning' | 'needs-wants' | 'money-basics';
}

interface Feedback {
  type: 'success' | 'error';
  message: string;
  explanation: string;
}

@Component({
  selector: 'app-finance-quiz',
  imports: [CommonModule, RouterModule],
  templateUrl: './finance-quiz.component.html',
  styleUrl: './finance-quiz.component.scss',
})
export class FinanceQuizComponent implements OnInit, OnDestroy {
  currentQuestion: Question | null = null;
  score = 0;
  feedback: Feedback | null = null;
  gameActive = true;
  timeLeft = 30; // 90 seconds for more thinking time
  level = 2;
  timerInterval: any;
  childId: number = parseInt(sessionStorage.getItem('childId') || '');
  totalQuestions: number = 0;
  currentQuestionIndex = 0;

  questions: Question[] = [
    {
      id: 1,
      question: 'What should you do with your pocket money to save it?',
      options: [
        'Spend it all on candy',
        'Put it in a piggy bank',
        'Give it away',
        'Hide it under your bed',
      ],
      correctAnswer: 'Put it in a piggy bank',
      explanation:
        'Piggy banks help you save money safely for things you really want!',
      category: 'saving',
    },
    {
      id: 2,
      question: 'Which of these is something you NEED, not just want?',
      options: ['A new toy', 'Food for dinner', 'Video games', 'Ice cream'],
      correctAnswer: 'Food for dinner',
      explanation:
        'Food is a need because our bodies require it to stay healthy and strong!',
      category: 'needs-wants',
    },
    {
      id: 3,
      question: 'How can a child earn money?',
      options: [
        'Doing chores at home',
        'Taking money from others',
        'Finding it on the street',
        'Asking friends for it',
      ],
      correctAnswer: 'Doing chores at home',
      explanation:
        'Doing chores is a great way to earn money by helping your family!',
      category: 'earning',
    },
    {
      id: 4,
      question: 'If you have ₦100 and spend ₦30, how much do you have left?',
      options: ['₦130', '₦70', '₦60', '₦100'],
      correctAnswer: '₦70',
      explanation:
        '₦100 minus ₦30 equals ₦70. Always subtract what you spend from what you have!',
      category: 'money-basics',
    },
    {
      id: 5,
      question: 'What is the best reason to save money?',
      options: [
        'To show off to friends',
        'To buy something special later',
        'To hide it from parents',
        'To count it every day',
      ],
      correctAnswer: 'To buy something special later',
      explanation:
        'Saving helps you buy bigger, better things that make you happy!',
      category: 'saving',
    },
    {
      id: 6,
      question: 'Which coin is worth the most?',
      options: ['₦1 coin', '₦2 coin', '50 kobo coin', '₦5 coin'],
      correctAnswer: '₦5 coin',
      explanation: '₦5 is worth more than ₦2, ₦1, or 50 kobo!',
      category: 'money-basics',
    },
    {
      id: 7,
      question: 'What should you do before buying a toy?',
      options: [
        'Buy it immediately',
        'Think about if you really want it',
        'Ask your friends to buy it',
        'Cry until someone buys it',
      ],
      correctAnswer: 'Think about if you really want it',
      explanation:
        "It's smart to think carefully before spending money on anything!",
      category: 'spending',
    },
    {
      id: 8,
      question: 'Which of these is a WANT, not a need?',
      options: [
        'Clean water',
        'A place to sleep',
        'New shoes when yours are broken',
        'The latest phone',
      ],
      correctAnswer: 'The latest phone',
      explanation:
        'A new phone is something you want, but water, shelter, and shoes are things you need!',
      category: 'needs-wants',
    },
    {
      id: 9,
      question: 'How much is ₦50 + ₦20?',
      options: ['₦30', '₦70', '₦60', '₦80'],
      correctAnswer: '₦70',
      explanation:
        '₦50 plus ₦20 equals ₦70. Adding money helps you know how much you have!',
      category: 'money-basics',
    },
    {
      id: 10,
      question: 'What is a budget?',
      options: [
        'A type of money',
        'A plan for spending money',
        'A place to keep money',
        'A way to make money',
      ],
      correctAnswer: 'A plan for spending money',
      explanation: 'A budget helps you plan how to spend your money wisely!',
      category: 'spending',
    },
    {
      id: 11,
      question:
        'If you want to buy something that costs ₦200, but you only have ₦150, what should you do?',
      options: [
        'Take money from someone else',
        'Buy it anyway',
        'Save more money first',
        'Forget about it forever',
      ],
      correctAnswer: 'Save more money first',
      explanation:
        'Saving up until you have enough money is the right way to buy what you want!',
      category: 'saving',
    },
    {
      id: 12,
      question: 'Why is it important to keep money safe?',
      options: [
        'So no one can see it',
        "So you don't lose it",
        'To make it grow bigger',
        'To make it look pretty',
      ],
      correctAnswer: "So you don't lose it",
      explanation:
        "Keeping money safe means you'll still have it when you need it!",
      category: 'money-basics',
    },
    {
      id: 13,
      question: 'What can you do to earn money at school?',
      options: [
        'Sell your lunch to friends',
        'Help classmates with their work for money',
        'Return lost items for a reward',
        'Take money from other students',
      ],
      correctAnswer: 'Return lost items for a reward',
      explanation:
        'Being helpful and honest, like returning lost things, can sometimes earn you a reward!',
      category: 'earning',
    },
    {
      id: 14,
      question: 'Which is smarter when shopping?',
      options: [
        'Buy the first thing you see',
        'Compare prices before buying',
        'Always buy the most expensive',
        'Never look at prices',
      ],
      correctAnswer: 'Compare prices before buying',
      explanation:
        'Comparing prices helps you get the best deal and save money!',
      category: 'spending',
    },
    {
      id: 15,
      question: 'What happens when you save a little money every week?',
      options: [
        'You get bored',
        'Your money grows bigger over time',
        'Your money disappears',
        'Nothing happens',
      ],
      correctAnswer: 'Your money grows bigger over time',
      explanation:
        'Saving regularly helps your money add up to bigger amounts!',
      category: 'saving',
    },
  ];

  constructor(private router: Router, private gameService: GameService) {}

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.shuffleQuestions();
    this.startNewRound();
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  shuffleQuestions(): void {
    // Shuffle the questions array for variety
    this.questions = this.shuffleArray(this.questions);
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  startNewRound(): void {
    // Get the next question
    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];

      // Shuffle the options for this question
      if (this.currentQuestion) {
        const shuffledOptions = this.shuffleArray([
          ...this.currentQuestion.options,
        ]);
        this.currentQuestion = {
          ...this.currentQuestion,
          options: shuffledOptions,
        };
      }
    } else {
      // Reset to beginning if we've gone through all questions
      this.currentQuestionIndex = 0;
      this.shuffleQuestions();
      this.currentQuestion = this.questions[0];
    }

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

  handleSelection(selectedAnswer: string): void {
    this.totalQuestions++;
    if (!this.gameActive || !this.currentQuestion) return;

    const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;

    if (isCorrect) {
      this.feedback = {
        type: 'success',
        message: 'Correct! Well done! 🎉',
        explanation: this.currentQuestion.explanation,
      };
      this.score += 10; // 10 points per correct answer

      // Update level based on score
      this.level = Math.floor(this.score / 50) + 1;

      // Move to next question after a delay
      setTimeout(() => {
        this.currentQuestionIndex++;
        this.startNewRound();
      }, 2500); // Longer delay to read explanation
    } else {
      this.feedback = {
        type: 'error',
        message: 'Not quite right. Try again! 🤔',
        explanation: `The correct answer is: ${this.currentQuestion.correctAnswer}. ${this.currentQuestion.explanation}`,
      };

      // Allow retry of the same question
      setTimeout(() => {
        this.feedback = null;
      }, 3000);
    }
  }

  endGame(): void {
    this.gameActive = false;
    clearInterval(this.timerInterval);
    this.submitGameSession();
  }

  resetGame(): void {
    this.score = 0;
    this.timeLeft = 30;
    this.gameActive = true;
    this.level = 1;
    this.currentQuestionIndex = 0;
    this.totalQuestions = 0;
    this.shuffleQuestions();
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
      correctAnswers: Math.floor(this.score / 10), // Each correct answer gives 10 points
      totalQuestions: this.totalQuestions,
      timeTaken: 90,
      name: 'Finance Quiz',
    };

    this.gameService
      .submitGameSession(data)
      .subscribe((data) => console.log(data));
  }

  // Utility function to get option letters (A, B, C, D)
  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A=65, B=66, C=67, D=68
  }

  // Utility function to get readable category names
  getCategoryName(category: string): string {
    const categoryMap: { [key: string]: string } = {
      saving: 'Saving Money',
      spending: 'Smart Spending',
      earning: 'Earning Money',
      'needs-wants': 'Needs vs Wants',
      'money-basics': 'Money Basics',
    };
    return categoryMap[category] || category;
  }

  // Make Math available in template
  Math = Math;
}
