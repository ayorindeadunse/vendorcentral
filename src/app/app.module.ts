import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import * as firebase from "firebase";

import { environment } from "../environments/environment";
import { AdminModule } from "./admin/admin.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./core/components/login/login.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { ProductsComponent } from "./shopping/components/products/products.component";
import { ShoppingModule } from "./shopping/shopping.module";

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    AdminModule,
    ShoppingModule,
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    [NgbModule],
    RouterModule.forRoot([
      { path: "", component: ProductsComponent },
      { path: "login", component: LoginComponent },
    ]),
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
