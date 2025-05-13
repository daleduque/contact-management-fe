import { Routes } from '@angular/router';
import { ContactFormComponent } from './core/contact-form/contact-form.component';
import { ContactListsComponent } from './core/contact-lists/contact-lists.component';
import { SigninComponent } from './core/signin/signin.component';
import { SignupComponent } from './core/signup/signup.component';
import { AuthGuard } from './shared/services/guard.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full'},
    { path: 'signin', component: SigninComponent},
    { path: 'register', component: SignupComponent},
    { path: 'contacts', component: ContactListsComponent, canActivate: [AuthGuard]},
    { path: 'contacts/add', component: ContactFormComponent, canActivate: [AuthGuard]},
    { path: 'contacts/edit/:id', component: ContactFormComponent, canActivate: [AuthGuard]},
];
