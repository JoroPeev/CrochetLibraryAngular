import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Toy, ToyImage } from '../../../models/toys';
import { HttpErrorResponse } from '@angular/common/http';

type ToyFormModel = Omit<Toy, 'price' | 'stock'> & {
  price: string;
  stock: string;
};

// DTO for updating images
interface ToyImageDto {
  imageUrl: string;
  displayOrder: number;
}

// Partial version for new product
type PartialToyFormModel = Partial<ToyFormModel> & {
  images: ToyImage[];
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
    primaryImageUrl: '',
    images: []
  };

  showAddForm: boolean = false;
  toyImages: { [toyId: string]: ToyImage[] } = {};
  isLoadingImages: { [toyId: string]: boolean } = {};
  
  // Track original images for comparison
  originalImages: { [toyId: string]: ToyImage[] } = {};

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
          } else {
            console.warn('Skipping image load for toy with undefined or null ID:', toy);
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
    if (!toyId) {
      console.warn('loadToyImages called with an empty or null toyId. Skipping image load.');
      return;
    }

    this.isLoadingImages[toyId] = true;
    this.apiService.getToyImages(toyId).subscribe({
      next: (images) => {
        this.toyImages[toyId] = images || [];
        // Store original images for comparison
        this.originalImages[toyId] = JSON.parse(JSON.stringify(images || []));
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404 && error.url?.includes('/images')) {
          console.warn(`No images found for toy ${toyId} (expected during testing). URL: ${error.url}`);
        } else if (error.status !== 0) {
          console.error(`Error loading images for toy ${toyId}:`, error);
          console.error(`HTTP Status: ${error.status}`);
          console.error(`HTTP Status Text: ${error.statusText}`);
          if (error.message) {
            console.error(`Error Message: ${error.message}`);
          }
          if (error.error) {
            console.error(`Backend Error Body:`, error.error);
          }
        } else {
          console.error(`Network or CORS error loading images for toy ${toyId}:`, error);
          console.error(`Error Message: ${error.message}`);
        }
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
    const primaryImage = images.find(img => img.isPrimary);
    return primaryImage?.imageUrl || images[0]?.imageUrl || this.PLACEHOLDER_IMAGE_PATH;
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

    // Create the toy object without ID for new toys
    const toy: any = {
      name: formModel.name.trim(),
      description: formModel.description?.trim() || '',
      price: Math.round(priceNum * 100) / 100,
      colors: formModel.colors?.trim() || '',
      stock: stockNum,
      primaryImageUrl: formModel.primaryImageUrl?.trim() || '',
      images: [] // Don't include images here - they're handled separately
    };

    // Only include ID for existing toys (updates)
    if (!isNewToy && formModel.id) {
      toy.id = formModel.id;
    }

    return toy as Toy;
  }

  addToy() {
    const toyToAdd = this.formModelToToy(this.newProduct as ToyFormModel, true);
    if (!toyToAdd) return;

    console.log('Creating toy with data:', toyToAdd);

    this.apiService.createToy(toyToAdd).subscribe({
      next: (newToy) => {
        console.log('New toy created:', newToy);
        
        // Check if we have images to add
        const imageUrls = this.newProduct.images
          .filter(img => img.imageUrl && img.imageUrl.trim())
          .map(img => img.imageUrl);
        
        if (imageUrls.length > 0) {
          console.log('Adding images:', imageUrls);
          // Add images after toy creation
          this.apiService.addImagesToToy(newToy.id, imageUrls).subscribe({
            next: () => {
              console.log('Images added successfully');
              alert('Product and images added successfully!');
              this.loadProducts();
              this.hideAddToyForm();
              this.loadToyImages(newToy.id);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Failed to add images:', error);
              alert('Product added but failed to add images: ' + (error.message || 'Unknown error'));
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
        console.error('Failed to add product:', error);
        console.error('Error status:', error.status);
        console.error('Error body:', error.error);
        
        // Enhanced error handling
        let errorMessage = 'Failed to add product';
        if (error.error && typeof error.error === 'object') {
          if (error.error.title) {
            errorMessage += ': ' + error.error.title;
          }
          if (error.error.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage += '\nValidation errors: ' + validationErrors.join(', ');
          }
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  editProduct(toy: Toy) {
    if (!toy.id) {
      console.error('Cannot edit toy without ID');
      return;
    }

    // Wait for images to load before editing
    if (!this.toyImages[toy.id] && !this.isLoadingImages[toy.id]) {
      this.loadToyImages(toy.id);
    }

    this.editingProduct = {
      ...toy,
      price: toy.price.toString(),
      stock: toy.stock.toString(),
      // Create deep copy of images to avoid reference issues
      images: this.toyImages[toy.id] ? JSON.parse(JSON.stringify(this.toyImages[toy.id])) : []
    };

    // Set primary image URL if not already set
    if (!this.editingProduct.primaryImageUrl && this.editingProduct.images.length > 0) {
      const primaryImage = this.editingProduct.images.find(img => img.isPrimary) || this.editingProduct.images[0];
      this.editingProduct.primaryImageUrl = primaryImage?.imageUrl || '';
    }
  }

  async saveProduct() {
    if (!this.editingProduct) {
      console.error('No product being edited');
      return;
    }

    const toyToSave = this.formModelToToy(this.editingProduct, false);
    if (!toyToSave) return;

    const toyId = toyToSave.id;
    if (!toyId || toyId.trim() === '') {
      console.error('Invalid toy ID:', toyId);
      alert('Invalid toy ID. Cannot update product.');
      return;
    }

    try {
      // First save the toy details (without images)
      await this.apiService.updateToy(toyId, toyToSave).toPromise();
      
      // Handle images separately
      await this.updateToyImages(toyId, this.editingProduct.images);
      
      alert('Product updated successfully!');
      this.loadProducts();
      this.loadToyImages(toyId);
      this.editingProduct = null;
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      console.error('Failed to update product:', httpError);
      alert('Failed to update product: ' + (httpError.message || 'Unknown error'));
      if (httpError.error) {
        console.error('Backend error details:', httpError.error);
      }
    }
  }

  // Method to handle image updates using your API endpoints
  private async updateToyImages(toyId: string, currentImages: ToyImage[]): Promise<void> {
    const originalImages = this.originalImages[toyId] || [];
    
    // Get new image URLs (images without IDs)
    const newImageUrls = currentImages
      .filter(img => !img.id && img.imageUrl && img.imageUrl.trim())
      .map(img => img.imageUrl);
    
    // Add new images if any
    if (newImageUrls.length > 0) {
      await this.addImagesToToy(toyId, newImageUrls);
    }
    
    // Update existing images that have changed
    for (const currentImg of currentImages) {
      if (currentImg.id) {
        const originalImg = originalImages.find(orig => orig.id === currentImg.id);
        if (originalImg && 
            (originalImg.imageUrl !== currentImg.imageUrl || 
             originalImg.displayOrder !== currentImg.displayOrder)) {
          await this.updateImage(currentImg.id, {
            imageUrl: currentImg.imageUrl,
            displayOrder: currentImg.displayOrder
          });
        }
      }
    }
  }

  // Helper method to add images to toy
  private async addImagesToToy(toyId: string, imageUrls: string[]): Promise<void> {
    try {
      await this.apiService.addImagesToToy(toyId, imageUrls).toPromise();
    } catch (error) {
      console.error('Failed to add images:', error);
      throw error;
    }
  }

  // Helper method to update individual image
  private async updateImage(imageId: string, dto: ToyImageDto): Promise<void> {
    try {
      await this.apiService.updateToyImage(imageId, dto).toPromise();
    } catch (error) {
      console.error('Failed to update image:', error);
      throw error;
    }
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (!id || id.trim() === '') {
      console.error('Invalid toy ID:', id);
      alert('Invalid toy ID. Cannot delete product.');
      return;
    }

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
        if (error.error) {
          console.error('Backend error details:', error.error);
        }
      }
    });
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  refreshToyImages(toyId: string): void {
    this.loadToyImages(toyId);
  }

  addNewImage() {
    this.newProduct.images.push({
      id: '',
      imageUrl: '',
      isPrimary: false,
      displayOrder: this.newProduct.images.length
    });
  }

  removeAddImage(index: number) {
    this.newProduct.images.splice(index, 1);
    this.newProduct.images.forEach((img, idx) => (img.displayOrder = idx));
  }

  addEditImage() {
    if (this.editingProduct) {
      this.editingProduct.images.push({
        id: '', // New images don't have IDs yet
        imageUrl: '',
        isPrimary: false,
        displayOrder: this.editingProduct.images.length
      });
    }
  }

  removeEditImage(index: number) {
    if (this.editingProduct) {
      this.editingProduct.images.splice(index, 1);
      this.editingProduct.images.forEach((img, idx) => (img.displayOrder = idx));
    }
  }

  // Update primary image when user selects a different primary
  updatePrimaryImage(selectedIndex: number) {
    if (this.editingProduct && this.editingProduct.images) {
      // Clear all primary flags
      this.editingProduct.images.forEach(img => img.isPrimary = false);
      // Set the selected image as primary
      this.editingProduct.images[selectedIndex].isPrimary = true;
      // Update the primary image URL
      this.editingProduct.primaryImageUrl = this.editingProduct.images[selectedIndex].imageUrl;
    }
  }

  // Validate image URLs
  validateImageUrl(url: string): boolean {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(url);
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByToyId(index: number, toy: Toy): string {
    return toy.id || '';
  }
}