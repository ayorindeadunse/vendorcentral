import { environment } from "./../../../../environments/environment";
import { Component, OnInit } from "@angular/core";

const BACKEND_URL =
  environment.apiUrl + "/activateUser/verification/get-activation-email";

@Component({
  selector: "app-activate-email",
  templateUrl: "./activate-email.component.html",
  styleUrls: ["./activate-email.component.css"],
})
export class ActivateEmailComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  url = BACKEND_URL;
}
