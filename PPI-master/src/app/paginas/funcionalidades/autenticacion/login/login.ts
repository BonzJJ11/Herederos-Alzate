import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LucideAngularModule, User, Lock, Eye, EyeOff } from 'lucide-angular';
import { AuthService } from '../../../../nucleo/servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  readonly User = User;
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  showPassword: boolean = false;
  forgotFeedback = '';
  forgotFeedbackType: 'success' | 'error' = 'success';
  loginError = '';

  loginForm;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false]
    });

    this.route.queryParamMap.subscribe((params) => {
      if (params.get('reset') === 'ok') {
        this.forgotFeedbackType = 'success';
        this.forgotFeedback = 'Tu contraseña fue actualizada correctamente. Inicia sesión.';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordInputType() {
    return this.showPassword ? 'text' : 'password';
  }

  forgotPassword() {
    const usernameControl = this.loginForm.get('username');
    const usernameValue = usernameControl?.value?.trim();

    if (!usernameValue) {
      this.forgotFeedbackType = 'error';
      this.forgotFeedback = 'Ingresa tu usuario o correo para recuperar tu contraseña.';
      return;
    }

    this.forgotFeedbackType = 'success';
    this.forgotFeedback = 'Procesando...';

    this.auth.forgotPassword(usernameValue).subscribe({
      next: (res: any) => {
        this.forgotFeedback = `Listo. Revisa tu correo ${res.mail}.`;
        
        // Pequeña espera para que el usuario lea el mensaje
        setTimeout(() => {
          this.router.navigate(['/codigo-recuperacion'], {
            queryParams: { 
              usuario: res.usuario,
              mail: res.mail
            }
          });
        }, 1500);
      },
      error: (err: any) => {
        this.forgotFeedbackType = 'error';
        this.forgotFeedback = err.error?.error || 'No se pudo procesar la solicitud.';
      }
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const username: string = this.loginForm.value.username ?? '';
    const password: string = this.loginForm.value.password ?? '';

    this.auth.login(username, password).subscribe({
      next: (response: any) => {
        this.loginError = '';
        const role = this.auth.getRole();

        if (role === 'admin') {
          this.router.navigate(['/splash'], { queryParams: { next: 'home' } });
        } else {
          this.router.navigate(['/splash'], { queryParams: { next: 'usuario/home' } });
        }
      },
      error: (err: any) => {
        this.loginError = 'Usuario o contraseña incorrectos.';
      }
    });
  }
}