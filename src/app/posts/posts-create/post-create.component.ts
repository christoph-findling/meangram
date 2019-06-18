import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { Title } from '@angular/platform-browser';
import { checkMimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreviewUrl: string;

  constructor(
    public postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      text: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [checkMimeType]
      })
    });
    // this.route.paramMap.subscribe((paramMap) => {
    //     if (paramMap.has('postId')) {
    //         this.isLoading = true;
    //         this.mode = 'edit';
    //         this.postId = paramMap.get('postId');
    //         this.postsService.getPost(this.postId).subscribe(post => {
    //             this.isLoading = false;
    //             // this.post = { id: post._id, title: post.title, content: post.content, imagePath: post.imagePath, creator: post.creator };
    //             this.post = post;
    //             this.form.setValue({
    //                 title: this.post.title,
    //                 content: this.post.content,
    //                 image: this.post.imagePath
    //             });
    //             this.imagePreviewUrl = this.post.imagePath;
    //         });
    //     } else {
    //         this.mode = 'create';
    //         this.postId = null;
    //     }
    // });
    this.route.data.subscribe(data => {
      if (data.post) {
        this.isLoading = true;
        this.mode = 'edit';
        this.postId = data.post.id;
        this.isLoading = false;
        this.post = data.post;
        this.form.setValue({
          text: this.post.text,
          image: this.post.imagePath
        });
        this.imagePreviewUrl = this.post.imagePath;
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImageChange(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPosts(this.form.value.text, this.form.value.image);
      this.form.reset();
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.text,
        this.form.value.image,
        this.form.value.userId
      );
    }
  }
}
