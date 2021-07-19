import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostListComponent } from './post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PostsRoutingModule } from './posts-routing.module';

@NgModule({
    declarations: [
        PostCreateComponent,
        PostListComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        PostsRoutingModule
    ]
})
export class PostsModule { }