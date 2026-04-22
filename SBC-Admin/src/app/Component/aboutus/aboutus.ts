import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aboutus',
  imports: [FormsModule, CommonModule],
  templateUrl: './aboutus.html',
  styleUrl: './aboutus.css',
})
export class Aboutus implements OnInit {

  about: any;

  constructor(private route: Router, private service: SBC, private toast: ToastrNotificationService) { }

  ngOnInit(): void {
    this.getalldata();
  }

  Addabout() {
    this.route.navigate(['/AboutUs/AddAbout'])
  }

  Editabout(d: any) {
    this.route.navigate(['/AboutUs/AddAbout'], { state: { data: d } });
  }

  getalldata() {
    this.service.getallabout().subscribe(
      (resp: any) => {
        if (resp.status) {
          this.about = resp.data;
          this.toast.showSuccess(resp.message)
        } else {
          this.toast.showError(resp.message)
        }
      }
    )
  }

  deleteabout(aboutID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteabout(aboutID).subscribe(
          (resp: any) => {
            this.toast.showSuccess(resp.message);
            this.getalldata();
          },
          (err: any) => {
            console.log(err);
            this.toast.showError('Delete failed');
          }
        );
      }
    });
  }



}
