import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; // import your components
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { SignupComponent } from './signup/signup.component';
import { ImgToPdfComponent } from './img-to-pdf/img-to-pdf.component';
import { ImageToTextComponent } from './image-to-text/image-to-text.component';
import { WordCountComponent } from './word-count/word-count.component';
import { ChatgptCheckerComponent } from './chatgpt-checker/chatgpt-checker.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'img2pdf', component: ImgToPdfComponent},
  { path: 'img2txt', component: ImageToTextComponent},
  { path: 'wordcount', component: WordCountComponent},
  { path: 'aichecker', component: ChatgptCheckerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
