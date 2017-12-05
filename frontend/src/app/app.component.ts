import { Component } from '@angular/core';

import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  x = 'あい';
  
  convert(videoId: string) {
      this.http.post('http://localhost:3000/convert/' + videoId, {}).subscribe(data => {
          
      });
  }
  
  constructor(private http: HttpClient) {}
}
