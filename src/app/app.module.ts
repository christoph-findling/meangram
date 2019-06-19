import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HeaderComponent } from './header/header.component';
import { PostsService } from './posts/posts.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error/error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './posts/post.module';
import { ProfileComponent } from './user/profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CanDeactivateGuard } from './auth/can-deactivate-guard.service';
import { PostResolver } from './auth/post-resolver.service';
import { AbbreviationPipe } from './pipes/abbreviation';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    ProfileComponent,
    AbbreviationPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    PostModule,
    FormsModule
  ],
  providers: [
    PostsService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CanDeactivateGuard,
    PostResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
