import { Component,inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../shared/services/api.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
    signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  errorMsg: string = '';

  private snackBar = inject(MatSnackBar)

  constructor(
    private router: Router,
    private apiService: ApiService,
  ){}

  redirectToSignin(){
    this.router.navigate(['signin'])
  }

  submit() {
    if (this.signupForm.valid) {
      const userData = {
        username: this.signupForm.value.username!,
        password: this.signupForm.value.password!
      }
      this.apiService.signup(userData).pipe(
        catchError((error) => {
          this.errorMsg = error.message;
          throw error;
        })
      ).subscribe(response => {
        const token = response.access_token
        this.apiService.authenticateToken(token)
        this.showToast('Registration Successfully')
        this.router.navigate(['contacts'])
      });
    }
  }

  showToast(title: string){
    this.snackBar.open(`${title}`, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000
    });
  }
}
