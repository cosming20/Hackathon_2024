import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { readSync } from 'fs';

@Component({
  selector: 'app-maze-display',
  templateUrl: './maze-display.component.html',
  styleUrls: ['./maze-display.component.scss']
})
export class MazeDisplayComponent implements OnInit {
  mazeData: number[][] = [];
  startX: number = 0;
  startY: number = 0;
  finishX: number = 0;
  finishY: number = 0;

  constructor(private appService: AppService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const mazeId = '671bab6c92affba0b10fcfa6'; // Replace with dynamic ID if needed
    this.appService.getMaze(mazeId).subscribe((response) => {
      console.log(response);
      this.mazeData = response.maze.matrix;
      this.startX = response.maze.start_x;
      this.startY = response.maze.start_y;
      this.finishX = response.maze.finish_x;
      this.finishY = response.maze.finish_y;
      console.log(this.mazeData, this.startX);
    });
  }
}
