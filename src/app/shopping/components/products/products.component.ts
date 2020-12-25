import { ShoppingCart } from '../../../shared/models/shopping-cart';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { Product } from '../../../shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  cartSubscription: Subscription;
  products: AngularFireList<any>;
  initialProducts: Product[] = [];
  filteredProducts: Product[] = [];
  category;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.cart$ = await this.cartService.getCart();

    // this.cart = await this.cartService.getCart();
    this.populateProducts();
  }

  private populateProducts() {
    this.products = this.productService.getAll();
    this.subscription = this.products
      .snapshotChanges()
      .pipe(
        map((res) =>
          res.map((c, index) => {
            return {
              position: index + 1,
              key: c.payload.key,
              ...c.payload.val(),
            };
          })
        )
      )
      .subscribe((p) => {
        this.initialProducts = p;
        this.route.queryParamMap.subscribe((params) => {
          this.category = params.get('category');
          this.applyFilter();
        });
      });
  }

  private applyFilter() {
    this.filteredProducts = this.category
      ? this.initialProducts.filter((p) => p.category === this.category)
      : this.initialProducts;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
