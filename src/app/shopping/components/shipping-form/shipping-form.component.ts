import { Component, OnInit, Input } from "@angular/core";
import { ShoppingCart } from "../../../shared/models/shopping-cart";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../../../shared/services/auth.service";
import { OrderService } from "../../../shared/services/order.service";
import { Order } from "../../../shared/models/order";

@Component({
  selector: "shipping-form",
  templateUrl: "./shipping-form.component.html",
  styleUrls: ["./shipping-form.component.css"],
})
export class ShippingFormComponent implements OnInit {
  @Input("cart") cart: ShoppingCart;
  shipping = { name: "", addressLine1: "", addressLine2: "", city: "" };
  subscription: Subscription;
  userId: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(
      (user) => (this.userId = user.uid)
    );
  }

  async placeOrder() {
    let order = new Order(this.userId, this.shipping, this.cart);
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(["/order-success", result.key]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
