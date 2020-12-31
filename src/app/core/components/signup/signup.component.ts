import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {}

  register(form: NgForm) {
    // call http service
    //   this.auth.serverLogin(form.value.email, form.value.password);
  }
}
