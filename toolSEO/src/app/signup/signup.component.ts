import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']

})
export class SignupComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    this.http.post('http://localhost:3000/signup', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Signup successful! Now login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Signup failed: ' + err.error.message);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
