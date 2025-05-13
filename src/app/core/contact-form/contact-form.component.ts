import { Component, inject, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent {
  contactForms: FormGroup;
  isEditted: boolean = false;
  contactId: string = '';
  cities: string[] = [
    'Kuala Lumpur', 'Klang', 'Kajang', 'Kota Kinabalu', 'Sandakan',
    'Padawan', 'Kulai', 'Tawau', 'Ampang Jaya', 'Kuantan'
  ];
  errorMsg: string = '';
  private snackBar = inject(MatSnackBar)

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private activeRoutes: ActivatedRoute,
    private router: Router,
  ) {
    this.contactForms = this.formBuilder.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.contactId = this.activeRoutes.snapshot.paramMap.get('id') || ''
    this.contactId && this.patchValue(this.contactId)
  }

  patchValue(id: string){
    this.isEditted = true
    this.apiService.getContact(id).subscribe(response => {
      this.contactForms.patchValue({
        name: response.name,
        title: response.title,
        email: response.email,
        phone: response.phone,
        address: response. address,
        city: response.city
      })
    })
  }

  submit() {
    if (this.contactForms.valid) {
      const contactDatas = {
        name: this.contactForms.value.name!,
        title: this.contactForms.value.title!,
        email: this.contactForms.value.email!,
        address: this.contactForms.value.address!,
        phone: this.contactForms.value.phone!,
        city: this.contactForms.value.city!
      }
      if (this.isEditted) {
        this.apiService.updateContact(this.contactId, contactDatas).subscribe(response=>{
          this.showToast('Successfully Updated!')
          if(response) this.router.navigate(['contacts']);
        })
      } else {
        this.apiService.addContact(contactDatas).subscribe(response=>{
          this.showToast('Successfully Added!')
          if(response) this.router.navigate(['contacts']);
        })
      }
    } else {
      this.errorMsg = 'Fill up all fields.';
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
