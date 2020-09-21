import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { LoginResponse } from '../core/models/login-response';
import { ServerResponseGeneric } from '../core/models/server-response';

@Injectable()
export class AuthInterceptor {

    private url = 'http://localhost:5000/api/';

    constructor(private http: HttpClient) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('intercept');
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken == null) {
            accessToken = sessionStorage.getItem('accessToken');
        }
        console.log(accessToken);
        if (accessToken) {
            const h = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken).append('Content-Type', 'application/json');
            req = req.clone({ headers: h });
            console.log(req);

        }


        return next.handle(req).pipe(catchError((err) => {
            if (err.status === 401) {
                console.log('inter');
                let refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    refreshToken = sessionStorage.getItem('refreshToken');
                }
                if (refreshToken) {
                    const headers = new HttpHeaders({
                        'Content-Type': 'application/json'
                    });

                    return this.http.post<ServerResponseGeneric<LoginResponse>>(`${this.url}adminaccount/token`, JSON.stringify(refreshToken), { headers })
                        .pipe(flatMap((result) => {
                            localStorage.clear();
                            sessionStorage.clear();
                            localStorage.setItem('accessToken', result.data.accessToken);
                            localStorage.setItem('refreshToken', result.data.refreshToken);
                            localStorage.setItem('notificationTag', 'uuid()');
                            accessToken = result.data.accessToken;
                            const h = new HttpHeaders().set('Authorization', 'Bearer ' + accessToken).append('Content-Type', 'application/json');
                            req = req.clone({ headers: h });
                            console.log(req);
                            return next.handle(req);
                        }));
                }
                throw err;
            } else if (err.status === 404) {
                console.log('404 - not found');
            }
        }));
    }

}
