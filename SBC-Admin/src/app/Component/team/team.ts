import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {

  TeamForm!: FormGroup;
  selectedFileName: string | null = null;
  selectedImageFile: File | null = null;
  team: any;
  iseditmodal:boolean = false;
  isModalOpen = false;
  imagePreview: any = null;
  currentTeamMemberID: any = null;
  searchTerm: string = '';


  ngOnInit(): void {
    this.getalldata();
  }

  constructor(private service: SBC,
    private toast: ToastrNotificationService,
    private fb: FormBuilder
  ) {
    this.TeamForm = this.fb.group({
      memberName: ['', Validators.required],
      memberRole: ['', Validators.required],
      memberImage: ['', Validators.required],
      instagramLink: ['', Validators.required],
      userID: [0],
      coreTeamMemberID:[0]
    })
  }


  

  OpenModal() {
    this.isModalOpen = true;
  }

  editteam(d:any){
    this.isModalOpen = true;
    this.iseditmodal = true;
    this.currentTeamMemberID = d.coreTeamMemberID;
    this.TeamForm.patchValue({
      memberName:d.memberName,
      memberRole:d.memberRole,
      memberImage:d.memberImage,
      instagramLink:d.instagramLink,
      userID:Number(sessionStorage.getItem('userid'))
    });
    this.imagePreview = d.memberImage;
  }

  closeModal() {
    this.isModalOpen = false;
    this.iseditmodal = false;
    this.imagePreview = null;
    this.currentTeamMemberID = null;
    this.TeamForm.reset();
  }

  fileChangeEvents(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList[0]) {
      const file = fileList[0];

      if (!file.type.startsWith('image/')) {
        this.toast.showError("Please select a valid image file");
        element.value = '';
        return;
      }

      this.selectedFileName = file.name;
      this.selectedImageFile = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.TeamForm.patchValue({ memberImage: e.target.result });
      };
    }
  }

  addteam() {
    let imagePayload = this.TeamForm.value.memberImage;
    if (imagePayload && imagePayload.includes('base64,')) {
      imagePayload = imagePayload.split('base64,')[1];
    } else if (this.iseditmodal && imagePayload && imagePayload.startsWith('http')) {
      imagePayload = imagePayload; 
    }

    const payload: any = {
      memberName: this.TeamForm.value.memberName,
      memberRole: this.TeamForm.value.memberRole,
      memberImage: imagePayload,
      instagramLink: this.TeamForm.value.instagramLink,
      userID: Number(sessionStorage.getItem('userid'))
    }

    if (this.iseditmodal) {
      payload.coreTeamMemberID = this.currentTeamMemberID;
      this.service.updateteammember(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.closeModal();
            this.getalldata();
          } else {
            this.toast.showError(resp.message);
          }
        }
      )
    } else {
      this.service.addteammember(payload).subscribe(
        (resp: any) => {
          if (resp.status) {
            this.toast.showSuccess(resp.message);
            this.closeModal();
            this.getalldata();
          } else {
            this.toast.showError(resp.message);
          }
        }
      )
    }
  }

  getalldata() {
    this.service.getallteam().subscribe(
      (resp: any) => {
        if (resp.status) {
          this.team = resp.data;
          this.toast.showSuccess(resp.message)
        } else {
          this.toast.showError(resp.message)
        }
      }
    )
  }

  deleteteam(coreTeamMemberID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteteam(coreTeamMemberID).subscribe(
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

  get filteredTeam(): any[] {
    if (!this.searchTerm) {
      return this.team;
    }
    const term = this.searchTerm.toLowerCase();
    return this.team.filter((member: any) => 
      (member.memberName && member.memberName.toLowerCase().includes(term)) ||
      (member.memberRole && member.memberRole.toLowerCase().includes(term))
    );
  }
}
