import { Component } from '@angular/core';
import { first } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent {
  mazes: any = [];
  currentPage: number = 1;
  totalPages: number = 0; // Assuming you'll get total pages from your backend
  
  constructor(private appService: AppService) {
    this.loadMazes(this.currentPage);
  }

  loadMazes(page: number): void {
    this.appService.getallMazes(page, 3) // Assuming limit of 10 per page
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.mazes = response.mazes;
          this.totalPages = response.totalPages; // Assuming your backend provides total pages
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMazes(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMazes(this.currentPage);
    }
  }
}
