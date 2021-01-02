import { AuthService } from "./../../../shared/services/auth.service";
import { SignupService } from "./../../../shared/services/signup.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signup: SignupService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.auth
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  register(form: NgForm) {
    // call signup service
    //   this.auth.serverLogin(form.value.email, form.value.password);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.signup.registerUser(form.value);
    // console.log(form.value);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
