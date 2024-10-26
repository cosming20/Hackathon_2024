import { Component, Input, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maze-display',
  templateUrl: './maze-display.component.html',
  styleUrls: ['./maze-display.component.scss']
})
export class MazeDisplayComponent implements OnInit {
  mazeData: number[][] = [];
  createdAt: string | undefined; // Variable to store the creation date
  @Input() postInput: any;

  constructor(private appService: AppService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Set maze data based on whether the maze is solved
    this.mazeData = this.postInput.matrixSolved != 0 ? this.postInput.matrixSolved : this.postInput.matrix;
    this.createdAt = this.postInput.createdAt;
    
    console.log(this.createdAt);
  }
}
