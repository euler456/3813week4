import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ImguploadService } from '../imgupload.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  selectedFile: any = null;
  imagepath = sessionStorage.getItem('filename');

  constructor(private router: Router, private httpClient: HttpClient, private imguploadService: ImguploadService) { }

  ngOnInit(): void {
    this.userProfile.username = sessionStorage.getItem('username');
    this.userProfile.email = sessionStorage.getItem('emails');
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateProfile() {
    const userId = sessionStorage.getItem('userid');
    const requestPayload = {
      action: 'editUser',
      userId: userId,
      username: this.userProfile.username,
      email: this.userProfile.email,
    };

    this.httpClient.post(BACKEND_URL + '/loginafter', requestPayload, httpOptions)
      .subscribe((data: any) => {
        if (data.valid == true) {
          sessionStorage.setItem('username', data.user.username);
          sessionStorage.setItem('emails', data.user.email);
          sessionStorage.setItem('filename', data.user.filename);
          alert('Profile updated successfully!');
        } else {
          console.log(data);
        }
      });
  }

  uploadProfileImage() {
    const userId = sessionStorage.getItem('userid');
    const username = sessionStorage.getItem('username'); // Get the username from session storage

    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);

    if (userId !== null) {
      fd.append('userId', userId);
    }

    const fileExtension = 'jpg'; // Force extension to JPG

    const filename = username + '.' + fileExtension;
    sessionStorage.setItem('filename', filename);
    this.imagepath = filename;

    this.imguploadService.imgupload(fd).subscribe(res => {
      // Handle the response here
    });
  }
}
