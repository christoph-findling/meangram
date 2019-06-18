import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    public isAuthenticated = false;
    private authObs: Subscription;
    public userName: string;

    constructor(private authService: AuthService) {

    }

    ngOnInit() {
        this.authObs = this.authService.getAuthObs().subscribe(state => {
            this.isAuthenticated = state;

            if (!state) {
                this.userName = '';
            } else {
                this.userName = this.authService.getUserName();
            }
        });
    }

    ngOnDestroy() {
        this.authObs.unsubscribe();
    }

    onLogout() {
        this.authService.logout();
    }
}
