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
  register(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post('http://localhost:5000/api/v1/auth/register', body, { withCredentials: true });
  }
  
}
