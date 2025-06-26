import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Received query params:', params); // ✅ debug log
      this.product = params;
    });
  }
}
