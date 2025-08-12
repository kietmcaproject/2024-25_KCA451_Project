import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppComponent } from './app.component';
import { WordCountComponent } from './word-count/word-count.component';
import { ImgToPdfComponent } from './img-to-pdf/img-to-pdf.component';
import { ImageToTextComponent } from './image-to-text/image-to-text.component';
import { ChatgptCheckerComponent } from './chatgpt-checker/chatgpt-checker.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    WordCountComponent,
    ImgToPdfComponent,
    DashboardComponent,
    ImageToTextComponent,
    ChatgptCheckerComponent,
    LoginComponent,
    DashboardComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule ,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
