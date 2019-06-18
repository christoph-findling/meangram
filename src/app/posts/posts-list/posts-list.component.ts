import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  pageSizeOptions = [2, 5, 10, 20];
  currentPage = 1;
  public isAuthenticated = false;
  private authSub: Subscription;
  public userId: string;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    console.log('user id: ' + this.userId);
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.authSub = this.authService.getAuthObs().subscribe(state => {
      this.isAuthenticated = state;
      if (state) {
        this.userId = this.authService.getUserId();
      }
      console.log('user id: ' + this.userId);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  deletePost(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(
      res => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    console.log('page changed');
    this.postsService.getPosts(pageData.pageSize, pageData.pageIndex + 1);
  }
}
