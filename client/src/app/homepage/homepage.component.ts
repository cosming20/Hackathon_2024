import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { first } from 'rxjs';

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

  constructor(private appService: AppService) {}

  createMatrix() {
    if (this.dimensionX && this.dimensionY) {
      this.matrix = Array.from({ length: this.dimensionY }, () =>
        Array.from({ length: this.dimensionX }, () => ({}))
      );
      this.startPosition = null;
      this.finishPosition = null;
    }
  }

  setPosition(x: number, y: number) {
    if (!this.startPosition) {
      this.startPosition = { x, y };
      this.matrix[y][x].isStart = true; // Set start position
    } else if (!this.finishPosition) {
      this.finishPosition = { x, y };
      this.matrix[y][x].isFinish = true; // Set finish position
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

  solveMaze() {
    if (this.startPosition && this.finishPosition) {
      const requestBody = {
        dimension_x: this.dimensionX,
        dimension_y: this.dimensionY,
        start_x: this.startPosition.x + 1, // Adjusting for 1-based index
        start_y: this.startPosition.y + 1,
        finish_x: this.finishPosition.x + 1,
        finish_y: this.finishPosition.y + 1,
        bricks: this.brickPercentage
      };

      this.appService.createMaze(requestBody).pipe(first()).subscribe({
        next: (response) => {
          console.log('Maze created successfully!', response);
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
