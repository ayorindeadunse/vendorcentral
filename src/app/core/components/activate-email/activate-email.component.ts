import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-activate-email",
  templateUrl: "./activate-email.component.html",
  styleUrls: ["./activate-email.component.css"],
})
export class ActivateEmailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  url =
    "http://localhost:9008/api/activateUser/verification/get-activation-email";
}
