import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Toy, ToyImage, Review } from '../../../models/toys';
import { HttpErrorResponse } from '@angular/common/http';

type ToyFormModel = Omit<Toy, 'price' | 'stock'> & {
  price: string;
  stock: string;
};

interface ToyImageDto {
  imageUrl: string;
  displayOrder: number;
};

type PartialToyFormModel = Partial<ToyFormModel> & {
  images: ToyImage[];
  reviews: Review[];
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

  newProduct: PartialToyFormModel = {
    name: '',
    price: '0',
    description: '',
    colors: '',
    stock: '0',
    craftingTimeInDays: 0,
    primaryImageUrl: '',
    images: [],
    reviews: []
  };

  showAddForm: boolean = false;
  toyImages: { [toyId: string]: ToyImage[] } = {};
  isLoadingImages: { [toyId: string]: boolean } = {};
  originalImages: { [toyId: string]: ToyImage[] } = {};
  deletedImageIds: string[] = [];

  private readonly PLACEHOLDER_IMAGE_PATH = 'assets/placeholder-image.png';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.apiService.getToys().subscribe({
      next: (data) => {
        this.toys = data;
        this.toys.forEach(toy => {
          if (toy.id) {
            this.loadToyImages(toy.id);
          }
        });
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        alert('Failed to load products.');
      }
    });
  }

  loadToyImages(toyId: string): void {
    if (!toyId) return;

    this.isLoadingImages[toyId] = true;
    this.apiService.getToyImages(toyId).subscribe({
      next: (images) => {
        this.toyImages[toyId] = images || [];
        this.originalImages[toyId] = JSON.parse(JSON.stringify(images || []));
      },
      error: (error: HttpErrorResponse) => {
        console.error(`Error loading images for toy ${toyId}:`, error);
        this.toyImages[toyId] = [];
        this.originalImages[toyId] = [];
      },
      complete: () => {
        this.isLoadingImages[toyId] = false;
      }
    });
  }

  getToyImages(toyId: string): ToyImage[] {
    return this.toyImages[toyId] || [];
  }

  getPrimaryImage(toyId: string): string {
    const images = this.getToyImages(toyId);
    const primary = images.find(img => img.isPrimary);
    return primary?.imageUrl || images[0]?.imageUrl || this.PLACEHOLDER_IMAGE_PATH;
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
      craftingTimeInDays: 0,
      primaryImageUrl: '',
      images: [],
      reviews: []
    };
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.PLACEHOLDER_IMAGE_PATH;
  }

  private formModelToToy(formModel: ToyFormModel, isNewToy: boolean = false): Toy | null {
    const priceNum = Number(formModel.price);
    const stockNum = Number(formModel.stock);

    if (!formModel.name?.trim() || isNaN(priceNum) || priceNum <= 0) {
      alert('Please fill in all required fields with valid values.');
      return null;
    }

    const toy: any = {
      name: formModel.name.trim(),
      description: formModel.description?.trim() || '',
      price: Math.round(priceNum * 100) / 100,
      colors: formModel.colors?.trim() || '',
      stock: stockNum,
      primaryImageUrl: formModel.primaryImageUrl?.trim() || '',
      craftingTimeInDays: formModel.craftingTimeInDays || 0,
      images: [],
      reviews: formModel.reviews || []
    };

    if (!isNewToy && formModel.id) {
      toy.id = formModel.id;
    }

    return toy as Toy;
  }

  addToy() {
    const toyToAdd = this.formModelToToy(this.newProduct as ToyFormModel, true);
    if (!toyToAdd) return;

    this.apiService.createToy(toyToAdd).subscribe({
      next: (newToy) => {
        const imageUrls = this.newProduct.images
          .filter(img => img.imageUrl && img.imageUrl.trim())
          .map(img => img.imageUrl);

        if (imageUrls.length > 0) {
          this.apiService.addImagesToToy(newToy.id, imageUrls).subscribe({
            next: () => {
              alert('Product and images added successfully!');
              this.loadProducts();
              this.hideAddToyForm();
              this.loadToyImages(newToy.id);
            },
            error: (error: HttpErrorResponse) => {
              alert('Product added but failed to add images: ' + error.message);
              this.loadProducts();
              this.hideAddToyForm();
            }
          });
        } else {
          alert('Product added successfully!');
          this.loadProducts();
          this.hideAddToyForm();
        }
      },
      error: (error: HttpErrorResponse) => {
        let message = 'Failed to add product';
        if (error.error && typeof error.error === 'object') {
          if (error.error.title) {
            message += ': ' + error.error.title;
          }
          if (error.error.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            message += '\nValidation errors: ' + validationErrors.join(', ');
          }
        } else if (error.message) {
          message += ': ' + error.message;
        }
        alert(message);
      }
    });
  }

  editProduct(toy: Toy) {
    if (!toy.id) return;

    if (!this.toyImages[toy.id] && !this.isLoadingImages[toy.id]) {
      this.loadToyImages(toy.id);
    }

    this.deletedImageIds = [];

    this.editingProduct = {
      ...toy,
      price: toy.price.toString(),
      stock: toy.stock.toString(),
      images: this.toyImages[toy.id] ? JSON.parse(JSON.stringify(this.toyImages[toy.id])) : [],
      reviews: toy.reviews || []
    };

    if (!this.editingProduct.primaryImageUrl && this.editingProduct.images.length > 0) {
      const primary = this.editingProduct.images.find(img => img.isPrimary) || this.editingProduct.images[0];
      this.editingProduct.primaryImageUrl = primary?.imageUrl || '';
    }
  }

  async saveProduct() {
    if (!this.editingProduct) return;

    const toyToSave = this.formModelToToy(this.editingProduct, false);
    if (!toyToSave || !toyToSave.id) return;

    const toyId = toyToSave.id;

    try {
      await this.apiService.updateToy(toyId, toyToSave).toPromise();

      for (const imageId of this.deletedImageIds) {
        try {
          await this.apiService.deleteToyImage(toyId, imageId).toPromise();
        } catch (err) {
          console.error(`Failed to delete image with ID ${imageId}`, err);
        }
      }
      this.deletedImageIds = [];

      await this.updateToyImages(toyId, this.editingProduct.images);

      alert('Product updated successfully!');
      this.loadProducts();
      this.loadToyImages(toyId);
      this.editingProduct = null;
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      console.error('Failed to update product:', httpError);
      alert('Failed to update product: ' + (httpError.message || 'Unknown error'));
    }
  }

  private async updateToyImages(toyId: string, currentImages: ToyImage[]): Promise<void> {
    const original = this.originalImages[toyId] || [];

    const newUrls = currentImages
      .filter(img => !img.id && img.imageUrl.trim())
      .map(img => img.imageUrl);

    if (newUrls.length > 0) {
      await this.addImagesToToy(toyId, newUrls);
    }

    for (const img of currentImages) {
      if (img.id) {
        const originalImg = original.find(o => o.id === img.id);
        if (originalImg && (originalImg.imageUrl !== img.imageUrl || originalImg.displayOrder !== img.displayOrder)) {
          await this.updateImage(toyId, img.id, {
            imageUrl: img.imageUrl,
            displayOrder: img.displayOrder
          });
        }
      }
    }
  }

  private async addImagesToToy(toyId: string, urls: string[]): Promise<void> {
    try {
      await this.apiService.addImagesToToy(toyId, urls).toPromise();
    } catch (error) {
      console.error('Failed to add images:', error);
      throw error;
    }
  }

  private async updateImage(toyId: string, imageId: string, dto: ToyImageDto): Promise<void> {
    try {
      await this.apiService.updateToyImage(toyId, imageId, dto).toPromise();
    } catch (error) {
      console.error('Failed to update image:', error);
      throw error;
    }
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.apiService.deleteToy(id).subscribe({
      next: () => {
        alert('Product deleted successfully!');
        delete this.toyImages[id];
        delete this.isLoadingImages[id];
        delete this.originalImages[id];
        this.loadProducts();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Failed to delete product:', error);
        alert('Failed to delete product.');
      }
    });
  }

  cancelEdit() {
    this.editingProduct = null;
    this.deletedImageIds = [];
  }

  refreshToyImages(toyId: string): void {
    this.loadToyImages(toyId);
  }

  addNewImage() {
    this.newProduct.images.push({
      id: '',
      imageUrl: '',
      isPrimary: false,
      displayOrder: this.newProduct.images.length + 1
    });
  }

  removeAddImage(index: number) {
    this.newProduct.images.splice(index, 1);
    this.newProduct.images.forEach((img, i) => (img.displayOrder = i));
  }

  addEditImage() {
    if (this.editingProduct) {
      this.editingProduct.images.push({
        id: '',
        imageUrl: '',
        isPrimary: false,
        displayOrder: this.editingProduct.images.length + 1
      });
    }
  }

  removeEditImage(index: number) {
    if (this.editingProduct) {
      const removed = this.editingProduct.images.splice(index, 1)[0];
      if (removed?.id) {
        this.deletedImageIds.push(removed.id);
      }
      this.editingProduct.images.forEach((img, i) => {
        img.displayOrder = i + 1;
      });
    }
  }

  updatePrimaryImage(index: number) {
    if (this.editingProduct) {
      this.editingProduct.images.forEach(img => img.isPrimary = false);
      this.editingProduct.images[index].isPrimary = true;
      this.editingProduct.primaryImageUrl = this.editingProduct.images[index].imageUrl;
    }
  }

  validateImageUrl(url: string): boolean {
    const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return pattern.test(url);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByToyId(index: number, toy: Toy): string {
    return toy.id || '';
  }
}
