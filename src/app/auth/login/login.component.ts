import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStateSub: Subscription;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.authStateSub = this.authService.getAuthObs().subscribe(state => {
            console.log('authstate changed: ' + state);
            if (!state) {
                this.isLoading = false;
            } else {
                this.router.navigate(['/']);
            }
        });
    }

    ngOnDestroy() {
        this.authStateSub.unsubscribe();
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.login(form.value.email, form.value.password);
    }
}
