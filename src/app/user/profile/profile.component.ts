import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CanComponentDeactivate } from 'src/app/auth/can-deactivate-guard.service';
import { checkMimeType } from '../../validators/mime-type.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent
  implements OnInit, OnDestroy, CanComponentDeactivate {
  user: User;
  authObs: Subscription;
  form: FormGroup;
  isLoading = true;
  imagePreviewUrl = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('(?=[^A-z]*[A-z]).{3,}')
        ]
      }),
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            '[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*'
          )
        ]
      }),
      image: new FormControl(null, {
        // asyncValidators: [checkMimeType]
      })
    });
    this.authObs = this.authService.getAuthObs().subscribe(state => {
      if (!state) {
        this.isLoading = false;
      } else {
        this.user = this.authService.getUser();
        this.imagePreviewUrl = this.user.image;
        this.form.patchValue({
          name: this.user.name,
          email: this.user.email
        });
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.authObs.unsubscribe();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log('can deactivate');
    console.log(this.form.value.name);
    console.log(this.user.name);
    console.log(this.form.invalid);
    if (this.form.value.name !== this.user.name || this.form.invalid) {
      return confirm('You havent saved your changes');
    } else {
      return true;
    }
  }

  onImageChange(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const fileReader = new FileReader();
    fileReader.onload = () => {
      this.imagePreviewUrl = fileReader.result as string;
    };
    fileReader.readAsDataURL(file);
  }

  saveProfile() {
    console.log('save profile');
    this.authService.updateUser(
      this.form.value.name,
      this.form.value.email,
      this.form.value.image
    );
  }
}
