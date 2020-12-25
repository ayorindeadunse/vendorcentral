import { Component, Input } from "@angular/core";
import { ShoppingCartService } from "../../services/shopping-cart.service";

@Component({
  selector: "product-quantity",
  templateUrl: "./product-quantity.component.html",
  styleUrls: ["./product-quantity.component.css"],
})
export class ProductQuantityComponent {
  @Input("product") product;
  @Input("shopping-cart") shoppingCart;

  constructor(private cartService: ShoppingCartService) {}

  removeFromCart() {
    this.cartService.removeFromCart(this.product);
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}
