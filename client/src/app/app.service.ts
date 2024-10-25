import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }
  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post('http://localhost:5000/api/v1/auth/login', body, { withCredentials: true });
  }
  logout(): Observable<any> {
    return this.http.get('http://localhost:5000/api/v1/auth/logout', { withCredentials: true });
  }
  getallMazes(): Observable<any> {
    return this.http.get('http://localhost:5000/api/v1/maze/showMe', { withCredentials: true });
  }
  register(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post('http://localhost:5000/api/v1/auth/register', body, { withCredentials: true });
  }
  createMaze(body: { dimension_x: number; dimension_y: number; start_x: number; start_y: number; finish_x: number; finish_y: number; bricks: number }): Observable<any> {
    return this.http.post('http://localhost:5000/api/v1/maze/generate', body, { withCredentials: true });
  }
  getMaze(mazeId: string): Observable<any> {
    return this.http.get(`http://localhost:5000/api/v1/maze/${mazeId}`, { withCredentials: true });
  }
  solveMaze(maze_id: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/v1/maze/solve/${maze_id}`, {}, {withCredentials: true})
  }
  savePath(maze_id: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/v1/maze/solve/save/${maze_id}`, {}, {withCredentials: true})
  }
  isAuthenticated(): Observable<any> {
    return this.http.get<{ authenticated: boolean }>('http://localhost:5000/api/v1/auth/isAuthenticated', { withCredentials: true });
  }
}
