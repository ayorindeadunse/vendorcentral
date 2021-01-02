import { Register } from "./../models/register-user";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";

@Injectable({
  providedIn: "root",
})
export class SignupService {
  // private register: Register;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  registerUser(register: Register) {
    // post to server

    this.http.post(BACKEND_URL, register).subscribe((response: any) => {
      if (response.user.status === "Pending") {
        this.router.navigate(["/activate-email"]);
      } else {
        // redirect to error page.
      }
    });
  }
}
