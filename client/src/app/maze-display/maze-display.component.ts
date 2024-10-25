import { Component, Input, OnInit } from '@angular/core';
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
  @Input() postInput: any;
  constructor(private appService: AppService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    if (this.postInput.matrixSolved != 0)
      this.mazeData = this.postInput.matrixSolved 
    else
    this.mazeData = this.postInput.matrix
    console.log(this.mazeData)
  }
}
