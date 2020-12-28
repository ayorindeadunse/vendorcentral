import { environment } from "./../../../environments/environment";
import { AuthData } from "./../models/login-data.model";
import { switchMap } from "rxjs/operators";
import { UserService } from "./user.service";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import * as firebase from "firebase";
import { AppUser } from "../models/app-user";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

const BACKEND_URL = environment.apiUrl + "/auth/";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<firebase.User>;
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  // set the other user properties and get them in the response.
  private authStatusListener = new Subject<boolean>();

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    // firebase.auth().onAuthStateChanged(function (user) {
    //   if (user) {
    //     // User is signed in.
    //     console.log(user.displayName);
    //     this.user$ = user;
    //     console.log(this.user$.displayName);
    //   } else {
    //     // No user is signed in.
    //   }
    // });
    this.user$ = afAuth.authState;

    firebase
      .auth()
      .getRedirectResult()
      .then(function (result) {
        if (result.credential) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = result.credential as firebase.auth.OAuthCredential;
          const token = credential.accessToken;
          // ...
        }
        // The signed-in user info.
        const user = result.user;

        userService.save(user);

        let returnUrl = localStorage.getItem("returnUrl");
        if (returnUrl) {
          localStorage.removeItem("returnUrl");
          router.navigateByUrl(returnUrl);
        }
      })
      .catch(function (error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  }
  // get userId
  getUserId() {
    return this.userId;
  }

  // auto auth user
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      // get all parameters
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  //Get Auth Data
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    // get other parameters as required...
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
  // set auth timer

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  serverLogin(email: string, password: string) {
    this.setReturnUrl();
    //implement calling of rest api logic
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; user: { userId: string } }>(
        BACKEND_URL + "login",
        authData
      )
      .subscribe(
        (response) => {
          // console.log(response);
          const token = response.token;
          // console.log(token);
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.user.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  private setReturnUrl() {
    let returnUrl = this.route.snapshot.queryParamMap.get("returnUrl") || "/";
    localStorage.setItem("returnUrl", returnUrl);
  }
  //oauth with google
  loginWithGoogle() {
    /*let returnUrl = this.route.snapshot.queryParamMap.get("returnUrl") || "/";
    localStorage.setItem("returnUrl", returnUrl);*/
    this.setReturnUrl();

    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  //oauth with facebook
  loginWithFacebook() {}
  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  logout() {
    // firebase log out
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });

    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  get appUser$(): Observable<AppUser> {
    return this.user$.pipe(
      switchMap((user) => {
        if (user) return this.userService.get(user.uid).valueChanges();

        return of(null);
      })
    );
  }
}
