import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class DockerService {

  constructor(private httpClient: HttpClient) { }

  downlodDockerImage(image: string, tag: string): Observable<any> {
    var body = { 'image': image, 'tag': tag };
    let hostIP = environment.hostIP;
    let port = environment.port;
    let apiUrl = `${hostIP}:${port}/api/docker/downloadImage`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.httpClient.post<Response>(apiUrl, body, httpOptions);
  }
}
