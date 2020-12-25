import { Component } from "@angular/core";
import { AuthService } from "../../../shared/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  invalidLogin: boolean;
  constructor(private auth: AuthService) {}

  signIn(credentials) {
    // call http service
    this.auth.serverLogin(credentials);
  }
  login() {
    this.auth.login();
  }
}
