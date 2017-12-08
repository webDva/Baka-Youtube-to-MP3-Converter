import {Component} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    x = 'あい';
    response = '';
    path = '';
    audio_file;

    convert(videoURL: string) {
        let match = videoURL.split("watch?v=")[1];
        this.response = "converting...";
        this.http.post('http://localhost:3000/convert/' + match, {}).subscribe(data => {
            this.response = 'done!';
            this.path = data['path'];
            //this.audio_file = 'http://localhost:3000/' + data['link'];

            this.http.get('http://localhost:3000/download/' + this.path).subscribe(data2 => {
                this.audio_file = data2;
            });

            //let blob = new Blob([new Uint8Array([data])], {type: 'audio/mpeg'});
            //this.audio_file = this.sanitzer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));            
        });


    }

    constructor(private http: HttpClient, private sanitzer: DomSanitizer) {}
}
