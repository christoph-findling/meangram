import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';
import { Observable } from 'rxjs';

@Injectable()
export class PostResolver implements Resolve<Post> {
  constructor(private postService: PostsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Post> | Promise<Post> | Post {
    return this.postService.getPost(route.params.postId);
  }
}
