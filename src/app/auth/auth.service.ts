import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private tokenTimer: any;
    private userId : string;
    authStatusListener = new BehaviorSubject<boolean>(false);
    constructor(private http: HttpClient, private router: Router) { }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable()
    }
    createUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        }
        this.http.post<{ message: string, user: AuthData }>(environment.apiURL + 'signup', authData).subscribe(
            (responseData) => {
                this.router.navigate(['/login']);
            }, error => {
                console.log(error);
                this.authStatusListener.next(false);
            }
        )
    }
    getUserId(){
        return this.userId;
    }
    loginUser(email: string, password: string) {
        const authData: AuthData = {
            email: email,
            password: password
        };
        this.http.post<{ token: string, expiresIn: number, userId : string }>(environment.apiURL + 'login', authData).subscribe(
            (responseData) => {
                // console.log(responseData)
                const token = responseData.token;
                this.token = token;

                if (this.token) {
                    this.authStatusListener.next(true);
                    this.userId = responseData.userId;
                    const tokenExpirationTime = responseData.expiresIn * 1000;
                    this.setTimer(tokenExpirationTime);
                    const nowDate = new Date();
                    const expirationDate = new Date(nowDate.getTime() + tokenExpirationTime);
                    this.saveAuthData(token, expirationDate, this.userId)
                    // console.log(expirationDate);
                    this.router.navigate(['/']);
                } else {
                    this.authStatusListener.next(false);
                }

            }, error => {
                console.log(error);
                this.authStatusListener.next(false);
            }
        )
    }
    getToken() {
        return this.token;
    }
    logout() {
        this.token = null;
        this.userId =null;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    autoLogin(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const nowDate = new Date();
        const tokenExpirationTime = authInformation.expiresIn.getTime() - nowDate.getTime();
        // console.log(authInformation, tokenExpirationTime)
        if(tokenExpirationTime > 0){
            this.token = authInformation.token;
            this.authStatusListener.next(true);
            this.userId = authInformation.userId;
            this.setTimer(tokenExpirationTime)
        }
    }
    private setTimer(tokenExpirationTime){
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, tokenExpirationTime);
    }
    private saveAuthData(token: string, expirationDate: Date, userId : string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiresIn', expirationDate.toISOString())
        localStorage.setItem('userId', userId)
    }
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('userId')
    }
    private getAuthData(){
        const token = localStorage.getItem('token');
        const expiresIn = localStorage.getItem('expiresIn');
        const userId = localStorage.getItem('userId');
        if(!token || !expiresIn){
            return;
        }
        return {
            token : token,
            expiresIn : new Date(expiresIn),
            userId : userId
        }
    }
}
