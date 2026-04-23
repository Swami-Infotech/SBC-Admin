import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import { UserType } from '../../Common/enum';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usermanagement',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usermanagement.html',
  styleUrl: './usermanagement.css',
})
export class Usermanagement implements OnInit {

  isModalOpen = false;
  isEditModalOpen = false;
  showPassword = false;
  userList: any[] = [];
  pageNumber: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  baseImage: string = '';
  Math = Math;
  selectedUser: any = null;
  newPassword: string = '';
  AdduserForm!: FormGroup;
  userTypeEnum = UserType;
  userTypeKeys = Object.keys(UserType).filter(key => isNaN(Number(key)));
  imagePreviewUrl: string | null = null;
  isPasswordVisible: boolean = false;
  searchTerm: string = '';

  constructor(private route: Router, private service: SBC, private toast: ToastrNotificationService, private fb: FormBuilder) {
    this.AdduserForm = this.fb.group({
      userID: [0],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: [''],
      userType: [null, Validators.required],
      address: ['', Validators.required],
      roleBadge: [''],
      userCity: ['', Validators.required],
      isActive: [true],
      userImage: ['', Validators.required],
      emergencyName: ['', Validators.required],
      emergencyNumber: ['', Validators.required],
      bikeName: ['', Validators.required],
      bikeModel: ['', Validators.required],
      bikeNumber: ['', Validators.required],
      experience: [0, Validators.required],
      occupation: ['', Validators.required],
      dob: ['', Validators.required],
      helmet: [false],
      jacket: [false],
      gloves: [false],
      partOfGroup: [false],
      joinDescription: ['', Validators.required],
      joinDate: ['', Validators.required],
      licenseNumber: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getalldata();
  }

  Adduser() {
    this.route.navigate(['/UserManagement/Adduser'])
  }

  Redirectuser(userID:number) {
    this.route.navigate(['/UserManagement/Userdetails',userID])
  }

  editUser(user: any) {
    this.openEditModal(user);
  }

  openEditModal(user: any) {
    this.isEditModalOpen = true;
    
    // Reset and enable all fields first
    this.AdduserForm.enable();
    this.AdduserForm.patchValue(user);

    // Robust patching
    if (user.dob) {
      this.AdduserForm.patchValue({ dob: user.dob.split('T')[0] });
    }
    if (user.joinDate) {
      this.AdduserForm.patchValue({ joinDate: user.joinDate.split('T')[0] });
    }
    if (user.userImage) {
      this.imagePreviewUrl = user.userImage;
      const raw = user.userImage.includes(',') ? user.userImage.split(',')[1] : user.userImage;
      this.AdduserForm.patchValue({ userImage: raw });
    }

    const booleanFields = ['helmet', 'jacket', 'gloves', 'partOfGroup', 'isActive'];
    booleanFields.forEach(field => {
      if (user[field] !== undefined) {
        const bValue = user[field] === true || user[field] === 'true' || user[field] === 1;
        this.AdduserForm.patchValue({ [field]: bValue });
      }
    });

    // Disable all fields EXCEPT password
    Object.keys(this.AdduserForm.controls).forEach(key => {
      if (key !== 'password') {
        this.AdduserForm.get(key)?.disable();
      }
    });

    this.AdduserForm.get('password')?.clearValidators();
    this.AdduserForm.get('password')?.updateValueAndValidity();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.AdduserForm.reset();
    this.imagePreviewUrl = null;
  }

  getUserTypeValue(key: any): number {
    return (this.userTypeEnum as any)[key];
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
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        const fullBase64 = e.target.result as string;
        this.imagePreviewUrl = fullBase64;
        const rawBase64 = fullBase64.split(',')[1];
        this.AdduserForm.patchValue({ userImage: rawBase64 });
      };
    }
  }

  updateUser() {
    const formValue = this.AdduserForm.getRawValue();
    
    const payload = {
      userID: formValue.userID,
      userName: formValue.userName,
      phoneNumber: formValue.phoneNumber,
      userType: formValue.userType,
      isActive: formValue.isActive,
      userImage: formValue.userImage,
      joinDate: formValue.joinDate ? new Date(formValue.joinDate).toISOString() : '',
      password: formValue.password
    };

    this.service.updateUser(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.showSuccess(res.message || "User updated successfully");
          this.closeEditModal();
          this.getalldata();
        } else {
          this.toast.showError(res.message || "Failed to update user");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong");
      }
    });
  }

  getalldata() {
    const sessionUserId = sessionStorage.getItem('userid');
    const payload = {
      userID: Number(sessionUserId),
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    this.service.getusermanagement(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.userList = res.data.user || [];
          this.totalRecords = res.data.totalcount || 0;
        } else {
          this.toast.showError(res.message || "Failed to fetch user list");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong");
      }
    });
  }

  changePage(page: number) {
    this.pageNumber = page;
    this.getalldata();
  }

  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getalldata();
    }
  }

  nextPage() {
    if (this.pageNumber * this.pageSize < this.totalRecords) {
      this.pageNumber++;
      this.getalldata();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  getPages(): number[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: number[] = [];
    const current = this.pageNumber;
    
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (current >= total - 3) {
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
    return pages;
  }

  get showFirstEllipsis(): boolean {
    return this.totalPages > 7 && this.pageNumber > 4;
  }

  get showLastEllipsis(): boolean {
    return this.totalPages > 7 && this.pageNumber < this.totalPages - 3;
  }

  toggleStatus(user: any) {
    const adminUserId = sessionStorage.getItem('userid') || '0';
    const newStatus = !user.isActive;

    this.service.changeuserstatus(user.userID, Number(adminUserId), String(newStatus)).subscribe({
      next: (res: any) => {
        if (res.status) {
          user.isActive = newStatus;
          this.toast.showSuccess(res.message || "Status updated successfully");
        } else {
          this.toast.showError(res.message || "Failed to update status");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong");
      }
    });
  }

  openPasswordModal(user: any) {
    this.selectedUser = user;
    this.newPassword = '';
    this.isModalOpen = true;
  }

  closePasswordModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
    this.newPassword = '';
  }

  updatePassword() {
    if (!this.newPassword) {
      this.toast.showError("Please enter a new password");
      return;
    }

    const payload = {
      userID: this.selectedUser.userID,
      password: this.newPassword
    };

    this.service.changeuserpassword(payload).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.showSuccess(res.message || "Password updated successfully");
          this.closePasswordModal();
        } else {
          this.toast.showError(res.message || "Failed to update password");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong");
      }
    });
  }

  get filteredUserList(): any[] {
    if (!this.searchTerm) {
      return this.userList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.userList.filter(user => 
      (user.userName && user.userName.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.phoneNumber && user.phoneNumber.includes(term))
    );
  }
}
