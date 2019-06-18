import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStateSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStateSub = this.authService.getAuthObs().subscribe(state => {
      if (!state) {
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      form.value.email,
      form.value.password,
      form.value.name,
      form.value.nickname
    );
  }
}
