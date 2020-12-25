import { CategoryService } from '../../../../shared/services/category.service';
import { Component, Input } from '@angular/core';
import { AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css'],
})
export class ProductFilterComponent {
  categories: AngularFireList<any>;
  categories$: Observable<any[]>;
  @Input('category') category;

  constructor(categoryService: CategoryService) {
    this.categories = categoryService.getAll();
    this.categories$ = this.categories
      .snapshotChanges()
      .pipe(
        map((res) =>
          res.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );
  }
}
