import { Product } from '../../../shared/models/product';
import { AngularFireList } from '@angular/fire/database';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../shared/services/product.service';
import { Observable, of } from 'rxjs';
import { CategoryService } from '../../../shared/services/category.service';
import { Component } from '@angular/core';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent {
  categories: AngularFireList<any>;
  categories$: Observable<any[]>;
  product = { title: '', category: '', price: null, imageUrl: '' } as Product;
  id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    // this.categories$ = this.categoryService.getCategories().valueChanges();
    this.categories = this.categoryService.getAll();
    this.categories$ = this.categories
      .snapshotChanges()
      .pipe(
        map((res) =>
          res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id)
      this.productService
        .get(this.id)
        .valueChanges()
        .pipe(take(1))
        .subscribe((p) => (this.product = p as Product));
  }

  save(product) {
    if (this.id) this.productService.update(product, this.id);
    else this.productService.create(product);

    this.router.navigate(['/admin/products']);
  }

  delete() {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id);
    this.router.navigate(['/admin/products']);
  }
}
