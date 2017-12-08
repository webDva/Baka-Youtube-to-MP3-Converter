import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    x = 'あい';
    response = '';

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.response = "converting...";
        this.http.post('http://localhost:3000/convert/' + match, {}).subscribe(data => {
            this.response = 'done!';
        });
    }

    constructor(private http: HttpClient) {}
}
