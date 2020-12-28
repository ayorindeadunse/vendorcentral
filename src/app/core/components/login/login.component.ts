import { Subscription } from "rxjs";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../../shared/services/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit, OnDestroy {
  invalidLogin: boolean;

  // loader
  isLoading = false;
  // Create a subscription property
  private authStatusSub: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.auth
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  signIn(form: NgForm) {
    // call http service
    this.auth.serverLogin(form.value.email, form.value.password);
  }
  loginG() {
    this.auth.loginWithGoogle();
  }

  // facebook oAuth login
  loginF() {
    // facebook auth logic.
    this.auth.loginWithFacebook();
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
