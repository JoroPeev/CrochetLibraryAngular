import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Toy, ToyImage } from '../../../models/toys';

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
  // Initialize newProduct with default values instead of empty object
  newProduct: Partial<ToyFormModel> = {
    name: '',
    price: '0',
    description: '',
    colors: '',
    stock: '0',
    primaryImageUrl: '',
    images: []
  };
  showAddForm: boolean = false;
  toyImages: { [toyId: string]: ToyImage[] } = {}; // Store images for each toy
  isLoadingImages: { [toyId: string]: boolean } = {}; // Track loading state per toy

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getToys().subscribe({
      next: (data) => {
        this.toys = data;
        // Load images for each toy
        this.toys.forEach(toy => {
          this.loadToyImages(toy.id);
        });
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        alert('Failed to load products.');
      }
    });
  }

  // Load images from database for a specific toy
  loadToyImages(toyId: string): void {
    if (!toyId) return;

    this.isLoadingImages[toyId] = true;
    this.apiService.getToyImages(toyId).subscribe({
      next: (images) => {
        this.toyImages[toyId] = images || [];
      },
      error: (error) => {
        console.error(`Error loading images for toy ${toyId}:`, error);
        this.toyImages[toyId] = [];
      },
      complete: () => {
        this.isLoadingImages[toyId] = false;
      }
    });
  }

  // Get images for a specific toy
  getToyImages(toyId: string): ToyImage[] {
    return this.toyImages[toyId] || [];
  }

  // Get primary image for a toy
  getPrimaryImage(toyId: string): string {
    const images = this.getToyImages(toyId);
    const primaryImage = images.find(img => img.isPrimary);
    return primaryImage?.imageUrl || images[0]?.imageUrl || 'assets/placeholder-image.png';
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
      images: []
    };
  }

  // Handle image loading errors by setting placeholder image
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/placeholder-image.png';
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
      images: formModel.images || []
    };
  }

  addToy() {
    const toyToAdd = this.formModelToToy(this.newProduct as ToyFormModel);
    if (!toyToAdd) return;

    this.apiService.createToy(toyToAdd).subscribe({
      next: (newToy) => {
        alert('Product added successfully!');
        this.loadProducts();
        this.hideAddToyForm();
        // Load images for the new toy if it has an ID
        if (newToy?.id) {
          this.loadToyImages(newToy.id);
        }
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
      images: [...(this.getToyImages(toy.id) || [])]
    };
  }

  saveProduct() {
    if (!this.editingProduct) {
      console.error('No product being edited');
      return;
    }

    const toyToSave = this.formModelToToy(this.editingProduct);
    if (!toyToSave) return;

    const toyId = typeof toyToSave.id === 'string' ? Number(toyToSave.id) : toyToSave.id;

    this.apiService.updateToy(toyId, toyToSave).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.loadProducts();
        // Reload images for the updated toy
        if (this.editingProduct?.id) {
          this.loadToyImages(this.editingProduct.id);
        }
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
      const toyId = typeof id === 'string' ? Number(id) : id;

      this.apiService.deleteToy(toyId).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          // Remove images from cache
          delete this.toyImages[id];
          delete this.isLoadingImages[id];
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

  // Refresh images for a specific toy
  refreshToyImages(toyId: string): void {
    this.loadToyImages(toyId);
  }

  // ====== MULTI IMAGE MANAGEMENT ======

  addNewImage() {
    if (!this.newProduct.images) {
      this.newProduct.images = [];
    }
    this.newProduct.images.push({
      id: '',
      imageUrl: '',
      isPrimary: false,
      displayOrder: this.newProduct.images.length
    });
  }

  removeNewImage(index: number) {
    if (this.newProduct.images) {
      this.newProduct.images.splice(index, 1);
    }
  }

  addEditImage() {
    if (!this.editingProduct?.images) {
      if (this.editingProduct) {
        this.editingProduct.images = [];
      }
    }
    this.editingProduct?.images?.push({
      id: '',
      imageUrl: '',
      isPrimary: false,
      displayOrder: this.editingProduct.images.length
    });
  }

  removeEditImage(index: number) {
    this.editingProduct?.images?.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
}