import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiConfig.baseUrl;
  private readonly authEndpoint = environment.apiConfig.auth.url;
  private readonly contactEndpoint = environment.apiConfig.contacts.url;


  constructor(
    private http: HttpClient,
    private jwtService: JwtHelperService,
    private router: Router
  ) {}

  signin(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authEndpoint}/signin`, user).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return throwError(() => new Error('Invalid credentials.'));
        }
        return throwError(() => new Error('An error occurred while logging in.'));
      })
    );
  }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authEndpoint}/signup`, user).pipe(
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => new Error('Username already exist.'));
        }
        return throwError(() => new Error('An error occurred while logging in.'));
      })
    );
  }

  addContact(contact: any): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.baseUrl}${this.contactEndpoint}`, contact, {headers:headers})
  }

  getContacts(): Observable<any>{
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrl}${this.contactEndpoint}`,{headers})
  }

  deleteContact(id:string): Observable<any>{
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.baseUrl}${this.contactEndpoint}/${id}`, {headers:headers})
  }

  updateContact(id: string, contactData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    return this.http.put(`${this.baseUrl}${this.contactEndpoint}/${id}`, contactData, { headers });
  }  

  getContact(id:string): Observable<any>{
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.baseUrl}${this.contactEndpoint}/${id}`,{headers})
  }

  authenticateToken(token:string){
    localStorage.setItem('token',token)
    let tokenPayload = this.jwtService.decodeToken(token);
    console.log(tokenPayload)
  }

  searchContact(params: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const cleanParams: any = {};
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    }
  
    return this.http.get(`${this.baseUrl}${this.contactEndpoint}/search`, { headers, params: cleanParams });
  }
  
  logout(){
    localStorage.clear()
    this.router.navigate(['signin'])
  }
}
