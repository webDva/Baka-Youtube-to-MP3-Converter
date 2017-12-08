import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ResponseContentType} from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    x = 'あい';
    response = '';
    audio_file: SafeUrl = '';

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.response = "converting...";
        this.http.post('http://localhost:3000/convert/' + match, null, {responseType: 'blob'}).subscribe(data => {
            let blob = new Blob([data], {type: 'audio/mpeg'});
            this.audio_file = this.sanitzer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
            
            this.response = 'done!';
            //this.audio_file = data;
            //this.audio_file = 'http://localhost:3000/' + data['link'];

            //let blob = new Blob([new Uint8Array([data])], {type: 'audio/mpeg'});
            //this.audio_file = this.sanitzer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));            
        });


    }

    constructor(private http: HttpClient, private sanitzer: DomSanitizer) {}
}
