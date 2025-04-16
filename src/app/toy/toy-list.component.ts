import { Component, OnInit } from '@angular/core';
import { ToyService, Toy } from '../toy/toy.service';

@Component({
  selector: 'app-toy-list',
  templateUrl: './toy-list.component.html'
})
export class ToyListComponent implements OnInit {
  toys: Toy[] = [];

  constructor(private toyService: ToyService) {}

  ngOnInit(): void {
    this.toyService.getToys().subscribe({
      next: (toys) => {
        this.toys = toys;
        console.log('Fetched toys:', toys);
      },
      error: (err) => {
        console.error('Error loading toys:', err);
      }
    });
  }
}
