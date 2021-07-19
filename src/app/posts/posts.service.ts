import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { Post } from './posts.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class PostsService {
    postChanged = new Subject<{ posts: Post[], totalPosts: number }>()
    posts: Post[] = [];


    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }
    onAddPost(postData: Post) {
        const postCredentials = new FormData();
        postCredentials.append('title', postData.title);
        postCredentials.append('content', postData.content);
        postCredentials.append('image', postData.image, postData.title);

        this.http.post<{ message: string, post: Post }>(environment.apiURL + 'posts', postCredentials).subscribe(
            (responseData) => {
                console.log(responseData.post)
                this.posts.push(responseData.post)
                this.postChanged.next({ posts: this.posts.slice(), totalPosts: null });
                this.router.navigate(['../'], { relativeTo: this.route });
            }
        )
    }

    updatePost(postId: string, postData: Post) {
        let postCredentials;
        if (typeof (postData.image) === 'object') {
            postCredentials = new FormData();
            postCredentials.append('_id', postData._id)
            postCredentials.append('title', postData.title);
            postCredentials.append('content', postData.content);
            postCredentials.append('image', postData.image, postData.title);
        } else {
            postCredentials = {
                _id: postData._id,
                title: postData.title,
                content: postData.content,
                image: postData.image,
            }
        }
        this.http.put<{ message: string, post: Post }>(environment.apiURL + 'posts/' + postId, postCredentials)
            .subscribe(
                (responseData) => {
                        const updatedPosts = [...this.posts];
                        const updatedPostIndex = updatedPosts.findIndex(p => p._id === postId);
                        updatedPosts[updatedPostIndex] = responseData.post;
                        this.posts = [...updatedPosts];
                        this.postChanged.next({ posts: this.posts.slice(), totalPosts: null });
                        this.router.navigate(['/posts'])
                }
            )
    }

    getPosts(postSizePerPage: number, currentPage: number) {
        // return this.posts.slice();

        this.http.get<{ message: string, posts: Post[], totalPosts: number }>(environment.apiURL + 'posts',
            {
                params: new HttpParams().set('currentPage', currentPage.toString()).append('postSizeOptions', postSizePerPage.toString())
            }
        ).subscribe(posts => {
            // console.log(posts);
            this.posts = [...posts.posts];
            this.postChanged.next({ posts: this.posts.slice(), totalPosts: posts.totalPosts });

        })
        return this.posts

    }

    getPostById(id: string) {
        //...
        return this.http.get<{ message: string, post: Post }>(environment.apiURL + 'posts/' + id)
    }

    deletePost(postId) {
        return this.http.delete<{ message: string }>(environment.apiURL + 'posts/' + postId);

    }


}
