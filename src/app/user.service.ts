import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
 
import { User } from './user';
 
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class UserService {
 
  private usersUrl = 'api/users';  // URL to web api
 
  constructor(
    private http: HttpClient) { }
 
  // getEmptyUser(): User {
  //   var emptyUser = {
  //     name: '',
  //     id: '',
  //     isActive: '',
  //     picture: '',
  //     age: '',
  //     email: '',
  //     latitude: '',
  //     longitude: ''
  //   }
  //   return emptyUser
  // }

  /** GET users from the server */
  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(users => console.log(`fetched users`)),
        catchError(this.handleError('getUsers', []))
      );
  }
 
  /** GET user by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: string): Observable<User> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          console.log(`${outcome} user id=${id}`);
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }
 
  /** GET user by id. Will 404 if id not found */
  getUser(id: string): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => console.log(`fetched user id=${id}`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }
 
  /* GET users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<User[]>(`api/users/?name=${term}`).pipe(
      tap(_ => console.log(`found userss matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }
 
  //////// Save methods //////////
 
  /** POST: add a new user to the server */
  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions).pipe(
      tap((user: User) => console.log(`added user w/ id=${user.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }
 
  /** DELETE: delete the user from the server */
  deleteUser (user: User | string): Observable<User> {
    const id = typeof user === 'string' ? user : user.id;
    const url = `${this.usersUrl}/${id}`;
 
    return this.http.delete<User>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted user id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }
 
  /** PUT: update the user on the server */
  updateUser (user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions).pipe(
      tap(_ => console.log(`updated user id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }
 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
       console.error(error);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}