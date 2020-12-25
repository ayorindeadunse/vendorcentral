import { ShoppingCart } from "../../../shared/models/shopping-cart";
import { Subscription } from "rxjs";
import { ShoppingCartService } from "../../../shared/services/shopping-cart.service";
import { AppUser } from "../../../shared/models/app-user";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../../shared/services/auth.service";

@Component({
  selector: "bs-navbar",
  templateUrl: "./bs-navbar.component.html",
  styleUrls: ["./bs-navbar.component.css"],
})
export class BsNavbarComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  appUser: AppUser;
  cart$: ShoppingCart;

  constructor(
    private auth: AuthService,
    private cartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.auth.appUser$.subscribe((appUser) => (this.appUser = appUser));

    this.subscription = await (await this.cartService.getCart()).subscribe(
      (cart) => {
        this.cart$ = cart;
      }
    );
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
