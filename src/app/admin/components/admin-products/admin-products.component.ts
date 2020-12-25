import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireList } from '@angular/fire/database';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../../shared/models/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  products: AngularFireList<any>;
  filteredProducts: any[];

  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = ['id', 'title', 'price', 'edit'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private productService: ProductService) {
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
        this.filteredProducts = p;

        this.dataSource = new MatTableDataSource(this.filteredProducts);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // filter(query: string) {
  //   this.filteredProducts = query
  //     ? this.finalProducts.filter((p) =>
  //         p.title.toLowerCase().includes(query.toLowerCase())
  //       )
  //     : this.finalProducts;
  // }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
