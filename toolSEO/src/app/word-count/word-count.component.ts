import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-word-count',
  templateUrl: './word-count.component.html',
  styleUrls: ['./word-count.component.css']
})
export class WordCountComponent implements OnInit {
  text: string = '';  // Stores the input text
  wordCount: number = 0;  // Stores the word count

  constructor(private router: Router) { }

  goTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  ngOnInit(): void {
    this.updateWordCount();
  }

  // Method to calculate the word count
  updateWordCount(): void {
    // Trim the input text and split it by spaces, then filter out any empty strings
    this.wordCount = this.text.trim().split(/\s+/).filter(Boolean).length;
  }
}
