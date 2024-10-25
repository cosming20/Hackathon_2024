import { Component } from '@angular/core';
import { first } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  mazes: any = []
  constructor(private appService : AppService) {
    this.appService
    .getallMazes()
    .pipe(first())
    .subscribe({
      next:(response) => {
        this.mazes = response.mazes;
        console.log(response)
      },
      error:(error)=>{
        console.log(error);
      }
    })
  }
}
