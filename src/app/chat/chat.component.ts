// chat.component.ts
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatService } from '../core/services/chat.service';
import { MessageFormatterPipe } from '../core/pipes/message-formatter.pipe';

interface Message {
  id: number;
  text: any;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, MessageFormatterPipe], // Add the pipe to imports
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  parentId = parseInt(sessionStorage.getItem('parentId') ?? '0');
  messages: Message[] = [];
  inputValue: string = '';
  isLoading: boolean = false;
  currentDate: string = '';
  childId: number = parseInt(sessionStorage.getItem('childId') || '');
  isParent: boolean = true;
  id!: number;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.currentDate = this.getCurrentDate();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  getCurrentDate(): string {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return now.toLocaleDateString('en-US', options);
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  async callAPI(message: string, id: number, isParent: boolean): Promise<any> {
    try {
      const response = await this.chatService
        .sendMessage(message, id, isParent)
        .toPromise();
      return response;
    } catch (error) {
      return error;
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.inputValue.trim() || this.isLoading) {
      return;
    }

    const userMessage = this.inputValue.trim();
    this.inputValue = '';
    this.isLoading = true;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messages.push(newUserMessage);

    if (!this.childId) {
      this.id = this.parentId;
    } else {
      this.id = this.childId;
      this.isParent = false;
    }

    try {
      // Call your API here
      const response = await this.callAPI(userMessage, this.id, this.isParent);

      // Add AI response
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      console.log(response);

      this.messages.push(aiMessage);
    } catch (error) {
      console.error('API Error:', error);

      // Handle error
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: error,
        sender: 'ai',
        timestamp: new Date(),
      };

      this.messages.push(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  autoResize(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
}
