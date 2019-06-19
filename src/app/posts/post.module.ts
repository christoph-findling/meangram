import { NgModule } from '@angular/core';
import { PostCreateComponent } from './posts-create/post-create.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from '../pipes/time-ago';

@NgModule({
  declarations: [PostCreateComponent, PostsListComponent, TimeAgoPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule
  ]
})
export class PostModule {}
