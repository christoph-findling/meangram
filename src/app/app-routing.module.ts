import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsListComponent } from './posts/posts-list/posts-list.component';
import { PostCreateComponent } from './posts/posts-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { CanDeactivateGuard } from './auth/can-deactivate-guard.service';
import { PostResolver } from './auth/post-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: PostsListComponent,
    pathMatch: 'full'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'create',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
    resolve: { post: PostResolver }
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
