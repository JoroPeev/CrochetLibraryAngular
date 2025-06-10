import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Toy } from '../../../models/toys';

// Form model to use strings for price and stock for easy form binding
type ToyFormModel = Omit<Toy, 'price' | 'stock'> & {
  price: string;
  stock: string;
};

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminProductListComponent implements OnInit {
  toys: Toy[] = [];
  editingProduct: ToyFormModel | null = null;
  newProduct: Partial<ToyFormModel> = {};
  showAddForm: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getToys().subscribe({
      next: (data) => {
        this.toys = data;
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        alert('Failed to load products.');
      }
    });
  }

  showAddToyForm() {
    this.showAddForm = true;
    this.resetNewProduct();
  }

  hideAddToyForm() {
    this.showAddForm = false;
    this.resetNewProduct();
  }

  resetNewProduct() {
    this.newProduct = {
      name: '',
      price: '0',
      description: '',
      colors: '',
      stock: '0',
      primaryImageUrl: '',
      imageUrls: []
    };
  }

  private formModelToToy(formModel: ToyFormModel): Toy | null {
    const priceNum = Number(formModel.price);
    const stockNum = Number(formModel.stock);

    if (!formModel.name || isNaN(priceNum) || priceNum <= 0) {
      alert('Please fill in all required fields with valid values.');
      return null;
    }

    return {
      id: formModel.id || '', // empty string for new toy; backend assigns GUID
      name: formModel.name,
      description: formModel.description || '',
      price: Math.round(priceNum * 100) / 100,
      colors: formModel.colors || '',
      stock: stockNum,
      primaryImageUrl: formModel.primaryImageUrl || '',
      imageUrls: formModel.imageUrls || []
    };
  }

  addToy() {
    const toyToAdd = this.formModelToToy(this.newProduct as ToyFormModel);
    if (!toyToAdd) return;

    this.apiService.createToy(toyToAdd).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.loadProducts();
        this.hideAddToyForm();
      },
      error: (error) => {
        console.error('Failed to add product:', error);
        alert('Failed to add product: ' + (error.message || 'Unknown error'));
      }
    });
  }

  editProduct(toy: Toy) {
    this.editingProduct = {
      ...toy,
      price: toy.price.toString(),
      stock: toy.stock.toString(),
      imageUrls: [...toy.imageUrls]
    };
  }

  saveProduct() {
    if (!this.editingProduct) {
      console.error('No product being edited');
      return;
    }

    const toyToSave = this.formModelToToy(this.editingProduct);
    if (!toyToSave) return;

    // Convert string ID to number for API service
    const toyId = typeof toyToSave.id === 'string' ? Number(toyToSave.id) : toyToSave.id;
    
    // DEBUG: Check ID conversion
    console.log('Original ID:', toyToSave.id, 'Converted ID:', toyId, 'Type:', typeof toyId);
    
    this.apiService.updateToy(toyId, toyToSave).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.loadProducts();
        this.editingProduct = null;
      },
      error: (error) => {
        console.error('Failed to update product:', error);
        alert('Failed to update product: ' + (error.message || 'Unknown error'));
      }
    });
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      // Convert string ID to number for API service
      const toyId = typeof id === 'string' ? Number(id) : id;
      
      // DEBUG: Check ID conversion
      console.log('Original ID:', id, 'Converted ID:', toyId, 'Type:', typeof toyId);
      
      this.apiService.deleteToy(toyId).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product.');
        }
      });
    }
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  // ====== MULTI IMAGE MANAGEMENT ======

  addNewImage() {
    if (!this.newProduct.imageUrls) {
      this.newProduct.imageUrls = [];
    }
    this.newProduct.imageUrls.push('');
  }

  removeNewImage(index: number) {
    if (this.newProduct.imageUrls) {
      this.newProduct.imageUrls.splice(index, 1);
    }
  }

  addEditImage() {
    if (!this.editingProduct?.imageUrls) {
      if (this.editingProduct) {
        this.editingProduct.imageUrls = [];
      }
    }
    this.editingProduct?.imageUrls?.push('');
  }

  removeEditImage(index: number) {
    this.editingProduct?.imageUrls?.splice(index, 1);
  }

  // Helper method to track by index for ngFor
  trackByIndex(index: number): number {
    return index;
  }
}