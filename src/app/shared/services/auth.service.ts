import { switchMap } from "rxjs/operators";
import { UserService } from "./user.service";
import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import * as firebase from "firebase";
import { AppUser } from "../models/app-user";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private userService: UserService,
    router: Router
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

  serverLogin(credentials) {
    //implement calling of rest api logic
  }
  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get("returnUrl") || "/";
    localStorage.setItem("returnUrl", returnUrl);

    firebase.auth().signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        // Sign-out successful.
      })
      .catch(function (error) {
        // An error happened.
      });
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
