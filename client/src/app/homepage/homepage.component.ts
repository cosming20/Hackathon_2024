import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { delay, first } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent {
  dimensionX: number;
  dimensionY: number;
  brickPercentage: number; // New property for brick percentage
  matrix: Array<Array<{ isStart?: boolean; isFinish?: boolean }>> = [];
  startPosition: { x: number; y: number } | null = null;
  finishPosition: { x: number; y: number } | null = null;
  mazeData: number[][] = [];
  startX: number = 0;
  startY: number = 0;
  finishX: number = 0;
  finishY: number = 0;
  isSolved: boolean = false;
  generated: boolean = false;
  maze_id: string = "";
  constructor(private appService: AppService) {}

  createMatrix() {
    if (this.dimensionX && this.dimensionY) {
      this.matrix = Array.from({ length: this.dimensionX }, () =>
        Array.from({ length: this.dimensionY }, () => ({}))
      );
      this.startPosition = null;
      this.finishPosition = null;
    }
  }
  

  setPosition(x: number, y: number) {
    if (!this.startPosition) {
      this.startPosition = { x, y }; // (y, x) if x is rows and y is columns
      this.matrix[y][x].isStart = true; // Set start position at (y, x)
    } else if (!this.finishPosition) {
      this.finishPosition = { x, y }; // (y, x)
      this.matrix[y][x].isFinish = true; // Set finish position at (y, x)
    } else {
      // Reset positions if both are set
      this.resetPositions();
      this.setPosition(x, y); // Set the new start position
    }
  }
  

  resetPositions() {
    this.matrix.forEach(row => row.forEach(cell => {
      cell.isStart = false;
      cell.isFinish = false;
    }));
    this.startPosition = null;
    this.finishPosition = null;
  }
  showsolveMaze(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.appService.solveMaze(this.maze_id)
        .pipe(first())
        .subscribe({
          next: (response) => {
            console.log('Maze created successfully!', response);
            this.mazeData = response.maze.matrixSolved;
            this.isSolved = true;
            this.generated = true;
            resolve();
          },
          error: (errorResponse) => {
            console.error('Error creating maze!', errorResponse);
            // alert(errorResponse.error?.msg || "Failed to create maze. Please try again.");
            alert("No paths found")
            reject(errorResponse);
          }
        });
    });
  }
  
  savePathMaze(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.appService.savePath(this.maze_id)
        .pipe(first())
        .subscribe({
          next: (response) => {
            this.mazeData = response.maze.matrixSolved;
            console.log("Path saved successfully!", response);
            resolve();
          },
          error: (errorResponse) => {
            console.error('Error saving path!', errorResponse);
            // alert(errorResponse.error?.msg || "Failed to save path. Please try again.");
            alert("nu sa putut bos")
            reject(errorResponse);
          }
        });
    });
  }
  

  handleButtonClick() {
    this.showsolveMaze().then(() => {
      this.savePathMaze();
    }).catch(error => {
      console.error("Error executing functions:", error);
    });
  }
  

  generateMaze() {
    if (this.startPosition && this.finishPosition) {
      const requestBody = {
        dimension_x: this.dimensionX, // Now represents rows
        dimension_y: this.dimensionY, // Now represents columns
        start_x: this.startPosition.y, // Adjusted for row (y)
        start_y: this.startPosition.x, // Adjusted for column (x)
        finish_x: this.finishPosition.y, // Adjusted for row (y)
        finish_y: this.finishPosition.x, // Adjusted for column (x)
        bricks: this.brickPercentage
      };
  
      this.appService.createMaze(requestBody).pipe(first()).subscribe({
        next: (response) => {
          console.log('Maze created successfully!', response);
          this.mazeData = response.maze.matrix;
          this.isSolved = true;
          // console.log(this.mazeData)
          this.generated = true;
          this.maze_id = response.maze._id
          // console.log(this.maze_id)
          // Handle the success response, e.g., display or process the solution
        },
        error: (errorResponse) => {
          console.error('Error creating maze!', errorResponse);
          // Show an alert with the error message if available, otherwise a default message
          if (errorResponse.error && errorResponse.error.msg) {
            alert(errorResponse.error.msg);
          } else {
            alert("Failed to create maze. Please try again.");
          }
        }
      });
    }
  }
  
}
