import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Post } from '../posts.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  content = '';
  isLoading = false;
  editMode = false;
  selectedPost: Post;
  private postId: string;
  imagePreview: string;
  authStatusSub: Subscription;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      (authStatus) => {
        this.isLoading = false;
      }
    )

    this.initForm();
    this.route.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.postId = params['id']
          this.isLoading = true;
          this.postsService.getPostById(this.postId).subscribe(
            (postData) => {

              this.isLoading = false
              this.selectedPost = { ...postData.post }
              this.editMode = true;
              this.initForm();

            }
          );
        }
        else {
          // this.isLoading = false
          this.editMode = false;
          this.postId = null;
          this.selectedPost = null;
        }
      }
    )
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({ images: file });
    this.postForm.get('images').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    }
    reader.readAsDataURL(file);
  }
  private initForm() {
    if (this.editMode) {
      this.postForm.setValue({
        'title': this.selectedPost.title,
        'content': this.selectedPost.content,
        'images': this.selectedPost.image
      })

    } else {
      this.postForm = new FormGroup({
        'title': new FormControl(null, Validators.required),
        'content': new FormControl(null, Validators.required),
        'images': new FormControl(null, [Validators.required], [mimeType])
      })
    }
  }
  onSubmit() {

    if (this.postForm.invalid) {
      return;
    }
    const title = this.postForm.get('title').value;
    const content = this.postForm.get('content').value;
    const image = this.postForm.value.images;
    const postData = { _id: this.postId, title: title, content: content, image: image }
    this.isLoading = true;
    if (this.editMode) {
      this.postsService.updatePost(this.postId, postData);

    } else {
      this.postsService.onAddPost(postData);
    }


    // this.onClear();
  }

  onClear() {
    this.postForm.reset()
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }


}
