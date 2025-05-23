import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom, Observable, throwError } from 'rxjs';
import { ResponseModel } from './response-model';
import { AppStorage } from './app-storage';
import { common } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class ApiManager {
  constructor(private http: HttpClient, private appStorage: AppStorage) {}
  private setHeaders = (headersInArray: any[]) => {
    let headers: any = {};
    headersInArray.forEach((element) => {
      Object.keys(element).forEach((key) => {
        headers[key] = element[key];
      });
    });
    return { headers: new HttpHeaders(headers) };
  };

  request = async (
    config: { url: string; method: string },
    data: any,
    headers: any[]
  ) => {
    try {
      switch (config.method) {
        case 'GET':
          return await firstValueFrom(
            this.http.get<ResponseModel>(config.url, this.setHeaders(headers))
          );
        case 'POST':
          return await firstValueFrom(
            this.http.post<ResponseModel>(
              config.url,
              data,
              this.setHeaders(headers)
            )
          );
        case 'PUT':
          return await firstValueFrom(
            this.http.put<ResponseModel>(
              config.url,
              data,
              this.setHeaders(headers)
            )
          );
        case 'DELETE':
          return await firstValueFrom(
            this.http.delete<ResponseModel>(
              config.url,
              this.setHeaders(headers)
            )
          );
        default: {
          let response: ResponseModel = {
            data: 0,
            message: 'Unknown request type!',
            status: 0,
          };
          return response;
        }
      }
    } catch (error: any) {
      if (error.status != null) {
        if (String(error.status) === '401') {
          this.appStorage.clearAll();
          window.location.href = '/';
        }
      }
      throw error;
    }
  };
}
