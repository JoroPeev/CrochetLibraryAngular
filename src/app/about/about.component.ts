import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  showContactCard: boolean = false;

  toggleContactCard() {
    this.showContactCard = !this.showContactCard;
  }
}
