import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "./../shared/shared.module";
import { BsNavbarComponent } from "./components/bs-navbar/bs-navbar.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { ActivateEmailComponent } from "./components/activate-email/activate-email.component";

@NgModule({
  declarations: [
    BsNavbarComponent,
    HomeComponent,
    LoginComponent,
    ActivateEmailComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: "activate-email", component: ActivateEmailComponent },
    ]),
  ],
  exports: [BsNavbarComponent],
})
export class CoreModule {}
