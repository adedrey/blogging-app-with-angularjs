import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AuthGuard } from '../auth/auth-guard.service';

const postRoutes: Routes = [
    {
        path: 'posts', component: PostListComponent, children: [
            { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
            { path: 'edit/:id', component: PostCreateComponent, canActivate: [AuthGuard] }
        ]
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(postRoutes)
    ],
    exports: [
        RouterModule
    ],
})
export class PostsRoutingModule { }