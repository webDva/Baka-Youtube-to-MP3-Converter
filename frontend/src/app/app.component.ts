import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    x = 'あい';

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.http.post('http://localhost:3000/convert/' + match, {}).subscribe(data => {

        });
    }

    constructor(private http: HttpClient) {}
}
