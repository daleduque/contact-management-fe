import { Component, OnInit, inject } from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
import { ApiService } from '../../shared/services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    TableComponent,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule
  ],
  templateUrl: './contact-lists.component.html',
  styleUrl: './contact-lists.component.css'
})
export class ContactListsComponent implements OnInit {
  data: any = [];
  dataColumns: any = ['name', 'title', 'email', 'address', 'city', 'phone', ''];
  displayColumns: any = ['name', 'title', 'email', 'address', 'city', 'phone','actions'];
  totalData!: number;

  page: number = 1;
  total: number = 10;

  searchInputValue: string = '';
  sortBy: string = 'name';
  orderBy: string = 'asc';
  createdAt: any;

  
  private _snackBar = inject(MatSnackBar)

  constructor(
    private _apiService: ApiService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.getContact();
  }

  getContact() {
    this._apiService.getContacts().subscribe((response) => {
      this.data = response;
      this.totalData = response.length;
    });
  }

  pageNumberChange(page: number) {
    this.page = page

    this.searchContact()
  }

  pageSizeChange(pageSize: number) {
    this.total = pageSize

    this.searchContact()
  }

  navigateToAddContct() {
    this._router.navigate(['contacts/add']);
  }

  onKeyUp(event: KeyboardEvent): void {
    this.searchInputValue = (event.target as HTMLInputElement).value;

    if (this.searchInputValue === '') {
      this.createdAt = null;
      this.getContact();
    } else {
      this.searchContact();
    }
  }

  sortDataBy() {
    this.searchContact();
  }

  sortOrderBy() {
    this.searchContact();
  }

  onDateChange(event: any) {
    this.createdAt = event.value;
    this.searchContact();
  }


  searchContact() {
    const { searchInputValue, sortBy, orderBy, createdAt, page, total } = this;
  
    const params: any = {
      ...(searchInputValue && {
        name: searchInputValue,
        email: searchInputValue,
        city: searchInputValue,
      }),
      ...(sortBy && { sortBy }),
      ...(orderBy && { sortOrder: orderBy }),
      ...(createdAt && { createdAfter: new Date(createdAt).toISOString() }),
      page,
      limit: total,
    };
  
    this._apiService.searchContact(params).subscribe(response => {
      this.data = response.data;
    });
  }

  logout(){
    this._apiService.logout()
  }

  deleteContact(id:string){
    const contactId = id
    this._apiService.deleteContact(contactId).subscribe(response =>{
      this.openSnackBar('Contact Deleted!')
      window.location.reload()
    })
  }

  openSnackBar(title:string){
    this._snackBar.open(`${title}`, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 2000
    });
  }

  editContact(id:string){
    this._router.navigate([`contacts/edit/${id}`])
  }
}
