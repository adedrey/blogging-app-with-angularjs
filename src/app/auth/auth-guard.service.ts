import { CanActivate, UrlTree, Router } from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router"
import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    isAuthenticated : boolean = false;
    constructor(private authService : AuthService, private router :  Router){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean |UrlTree | Observable<boolean |UrlTree> | Promise<boolean |UrlTree> {
        this.authService.getAuthStatusListener().subscribe((isAuth) => {this.isAuthenticated =isAuth})
        if(this.isAuthenticated){
            return true;
        }
        return this.router.createUrlTree(['/login']);
    }
    
}