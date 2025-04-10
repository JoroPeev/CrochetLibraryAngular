import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true
})
export class NavbarComponent {
  @Output() pageChange = new EventEmitter<string>();
  
  navigate(page: string) {
    this.pageChange.emit(page);
  }
}