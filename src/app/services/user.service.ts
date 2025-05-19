import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../model/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(environment.API_URL);
  }

  getUserDetailsById(id: number): Observable<IUser> {
    return this.http.get<IUser>(`${environment.API_URL}/${id}`);
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(environment.API_URL, user);
  }

  updateUser(user: IUser, id: number): Observable<IUser> {
    return this.http.put<IUser>(`${environment.API_URL}/${id}`, user);
  }

  deleteUser(id: number): Observable<unknown> {
    return this.http.delete<unknown>(`${environment.API_URL}/${id}`);
  }
}
