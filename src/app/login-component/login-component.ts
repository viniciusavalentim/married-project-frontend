import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff, lucideLock } from '@ng-icons/lucide';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ lucideEye, lucideEyeOff, lucideLock })],
  templateUrl: './login-component.html',
})
export class LoginComponent {
  constructor(private router: Router) {}

  password = signal<string>('');
  showPassword = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<boolean>(false);

  togglePasswordVisibility() {
    this.showPassword.update((value) => !value);
  }

  onSubmit() {
    if (this.password() === '05122021') {
      localStorage.setItem('isAuthenticated', 'true');

      this.errorMessage.set('');
      this.successMessage.set(true);

      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 1000);
    } else {
      this.errorMessage.set('Senha incorreta. Tente novamente.');
      this.successMessage.set(false);
      this.password.set('');
    }
  }

  logout() {
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }
}
