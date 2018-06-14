import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import { HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
// import { Response  } from 'angular2/http';

@Injectable()
export class AuthServices {
  authToken: any;
  user: any;
  options;
  //  domain = 'http://localhost:3000';

  constructor(
    private http: Http
  ) { }
  // createAuthenticationHeaders() {
  //   this.loadToken();
  //   this.options = new RequestOptions({
  //     headers: new Headers({
  //       'Content-Type': 'application/json',
  //       'authorization': this.authToken
  //     })
  //   });
  // }
  // loadToken() {
  //   this.authToken = localStorage.getItem('token');
  // }
  // Function to register user accounts
  registerUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('api/register', user, {headers: headers})
      .map(res => res.json());
  }
  // log in function
  login(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post( 'api/login', user, {headers: headers})
      .map(res => res.json());
  }
  // store user jsonwebtoken
  storeUserData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
  // logout /
  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  // check experied tokenNotExpired /
  logedIn() {
    return tokenNotExpired();
  }
}
