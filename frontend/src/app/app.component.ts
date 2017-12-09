import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ResponseContentType} from '@angular/http';

import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    x = 'あい';
    response = '';
    audio_file: SafeUrl = '';
    mp3Data;

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.response = "converting...";
        this.http.post('http://localhost:3000/convert/' + match, null).subscribe(data => {
            this.mp3Data = data;
            this.response = 'done!';
        });
    }

    download(fileName: string) {
        this.http.get('http://localhost:3000/download/' + fileName.split("videos/")[1], {responseType: 'blob'}).subscribe(data => {
            let blob = new Blob([data], {type: 'audio/mpeg'});
            FileSaver.saveAs(blob, this.mp3Data.videoTitle + '.mp3');
        });
    }

    constructor(private http: HttpClient, private sanitzer: DomSanitizer) {}
}
