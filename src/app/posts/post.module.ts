import { NgModule } from '@angular/core';
import { PostCreateComponent } from './posts-create/post-create.component';
import { PostsListComponent } from './posts-list/posts-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [
        PostCreateComponent,
        PostsListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule
    ]
})
export class PostModule { }
