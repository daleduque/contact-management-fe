import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-signin',
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
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
    signinForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });
  errorMessage: string = '';
  private snackBar = inject(MatSnackBar)

  constructor(
    private router: Router,
    private apiService: ApiService,
  ){}

  submit() {
       if (this.signinForm.valid) {
      const userData = {
        username: this.signinForm.value.username!,
        password: this.signinForm.value.password!
      }
      this.apiService.signin(userData).pipe(
        catchError((error) => {
          this.errorMessage = error.message;
          this.showToast(this.errorMessage)
          throw error;
        })
      ).subscribe(response => {
        const token = response.access_token
        this.apiService.authenticateToken(token)
        this.showToast('Signin Successfully')
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

  redirectToRegistraton(){
    this.router.navigate(['register'])
  }
}

