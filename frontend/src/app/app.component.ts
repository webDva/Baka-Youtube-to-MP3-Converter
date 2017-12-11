import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    response = '';
    mp3Data;

    baseUrl = '';

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.response = "Converting your video... baka!";
        this.http.post(this.baseUrl + '/convert/' + match, null).subscribe(data => {
            if (data['failed']) {
                this.response = 'Failed to convert your video! Baka!';
            }
            else {
                this.mp3Data = data;
                this.response = this.mp3Data.videoTitle + ' has been converted, baka!';
            }
        });
    }

    download(fileName: string) {
        this.http.get(this.baseUrl + '/download/' + fileName.split("videos/")[1], {responseType: 'blob'}).subscribe(data => {
            let blob = new Blob([data], {type: 'audio/mpeg'});
            FileSaver.saveAs(blob, this.mp3Data.videoTitle + '.mp3');
        });
    }

    constructor(private http: HttpClient) {}

    ngOnInit() {
        if (!environment.production) {
            this.baseUrl = 'http://localhost:3000';
        }
    }
}
