import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AuthGuard } from './auth/auth-guard.service';

const appRoutes: Routes = [
    { path: '', component: PostListComponent },

]

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [AuthGuard]
})
export class AppRoutingModule { }