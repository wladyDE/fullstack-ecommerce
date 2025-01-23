import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next))
  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>>{
    const securedEndpoints = ['http://localhost:8080/api/orders']

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {
      const token = await this.oktaAuth.tokenManager.get('accessToken');

      if (token && 'accessToken' in token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken}`
          }
        });
      } else {
        console.warn('Access token not available or incorrect type');
      }
    }

    return await lastValueFrom(next.handle(request))
  }
}
