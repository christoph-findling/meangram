import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NumberSymbol } from '@angular/common';

import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  maxPosts = 0;
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&currentPage=${currentPage}`;
    console.log(queryParams);
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                id: post._id,
                text: post.text,
                imagePath: post.imagePath,
                creatorId: post.creatorId,
                creatorName: post.creatorName,
                creatorNickname: post.creatorNickname,
                comments: post.comments,
                date: post.date
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.posts;
        this.maxPosts = transformedPosts.maxPosts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.maxPosts
        });
      });
  }

  getPost(id: string) {
    return this.http
      .get<{
        _id: string;
        text: string;
        imagePath: string;
        creatorId: string;
        creatorName: string;
        creatorNickname: string;
        date: string;
        comments: Array<{
          text: string;
          data: string;
          creatorId: string;
          creatorName: string;
          creatorNickname: string;
          date: string;
        }>;
      }>(BACKEND_URL + '/' + id)
      .pipe(
        map(post => {
          const mappedPost = {
            id: post._id,
            text: post.text,
            imagePath: post.imagePath,
            creatorId: post.creatorId,
            creatorName: post.creatorName,
            creatorNickname: post.creatorNickname,
            comments: post.comments,
            date: post.date
          };
          return mappedPost;
        })
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePost(
    id: string,
    text: string,
    image: File | string,
    creatorId: string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('text', text);
      postData.append('image', image);
      postData.append('creatorId', null);
    } else {
      postData = {
        id,
        text,
        imagePath: image,
        creatorId: null,
        creatorName: null,
        creatorNickname: null,
        comments: null,
        date: null
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe(res => {
      this.router.navigate(['/']);
      console.log(res);
    });
  }

  addComment(id: string, text: string, callback) {
    const postData = {
      id,
      comment: text
    };
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe((res: { message: string; comment: Post['comments'][0] }) => {
        const index = this.posts.findIndex(post => post.id === id);
        this.posts[index].comments.push(res.comment);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: this.maxPosts
        });
        callback(true);
      });
  }

  addPosts(text: string, image: File) {
    // const post: Post = { id: null, title, content };
    const postData = new FormData();
    postData.append('text', text);
    postData.append('image', image);
    this.http
      .post<{ message: string; postId: string; imagePath: string }>(
        BACKEND_URL,
        postData
      )
      .subscribe(res => {
        // const post: Post = {
        //     id: res.postId,
        //     title: title,
        //     content: content,
        //     imagePath: res.imagePath
        // };
        this.router.navigate(['/']);
        console.log(res);
      });
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }
}
