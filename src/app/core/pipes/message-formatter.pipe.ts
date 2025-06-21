// message-formatter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'messageFormatter',
  standalone: true,
})
export class MessageFormatterPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    let formattedText = value
      // Convert triple asterisks to bold headers
      .replace(/\*\*\*(.*?):/g, '<strong>$1:</strong>')
      // Convert double asterisks to bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert single asterisks to italic (if not already processed)
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
      // Convert line breaks to HTML breaks
      .replace(/\n/g, '<br>')
      // Handle emoji and spacing better
      .replace(/([!🎮🏦💰🎉👋])\s*/g, '$1 ')
      // Ensure proper spacing after punctuation
      .replace(/([.!?])\s*([A-Z])/g, '$1<br><br>$2');

    // Clean up any double breaks
    formattedText = formattedText.replace(/<br><br><br>/g, '<br><br>');

    return this.sanitizer.bypassSecurityTrustHtml(formattedText);
  }
}
