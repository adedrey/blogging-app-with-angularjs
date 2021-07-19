import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../posts.model';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  userIsAuthenticated: boolean = false;
  private authSubscription : Subscription;
  private postSubscription : Subscription;
  isLoading = false;
  totalItems : number = 0
  postPerPage : number = 2;
  currentPage : number = 1
  pageSizeOptions= [1,2,5,10];
  private userId : string;
  constructor(private postsService: PostsService, private authService : AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.posts = this.postsService.getPosts(this.postPerPage, this.currentPage)
    this.postSubscription = this.postsService.postChanged.subscribe(
      (posts : {posts : Post[], totalPosts : number}) => {
        console.log(posts.posts)
        this.isLoading = false;
        this.posts = [...posts.posts];
        this.totalItems = posts.totalPosts
      }
    )
    this.authSubscription = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {

        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      }
    )

  }
  onChangedPage(pageData : PageEvent){
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage)
  }
  onDelete(postId) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    })
  }
  ngOnDestroy() {
    this.postSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
