import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SBC } from '../../../Service/sbc';
import { ToastrNotificationService } from '../../../Common/toastr-notification.service';
import { UserType } from '../../../Common/enum';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser implements OnInit {

  AdduserForm!: FormGroup;
  selectedFileName: string | null = null;
  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  userTypeEnum = UserType;
  isPasswordVisible: boolean = false;
  isEditMode: boolean = false;

  constructor(private route: Router,
    private service: SBC, private toast: ToastrNotificationService,
    private fb: FormBuilder
  ) {
    this.AdduserForm = this.fb.group({
      userID: [0],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
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
    })
  }

  userTypeKeys = Object.keys(UserType).filter(key => isNaN(Number(key)));

  ngOnInit(): void {
    // Check for edit mode using history.state
    const state = history.state as { userData: any };

    if (state && state.userData) {
      this.isEditMode = true;
      const user = state.userData;
      this.AdduserForm.patchValue(user);
      
      // Explicitly handle fields that might need formatting
      
      // Dates: Handle formats like ISO or YYYY-MM-DD
      if (user.dob) {
        const dobValue = typeof user.dob === 'string' ? user.dob.split('T')[0] : user.dob;
        this.AdduserForm.patchValue({ dob: dobValue });
      }
      if (user.joinDate) {
        const joinValue = typeof user.joinDate === 'string' ? user.joinDate.split('T')[0] : user.joinDate;
        this.AdduserForm.patchValue({ joinDate: joinValue });
      }

      // Image Preview: Check if it already has the prefix or not
      if (user.userImage) {
        if (user.userImage.startsWith('data:image')) {
          this.imagePreviewUrl = user.userImage;
          // Also strip it for the form control so save logic stays clean
          const raw = user.userImage.split(',')[1];
          this.AdduserForm.patchValue({ userImage: raw });
        } else {
          this.imagePreviewUrl = 'data:image/png;base64,' + user.userImage;
          this.AdduserForm.patchValue({ userImage: user.userImage });
        }
      }

      // Booleans: Ensure radio buttons get true/false values
      const booleanFields = ['helmet', 'jacket', 'gloves', 'partOfGroup', 'isActive'];
      booleanFields.forEach(field => {
        if (user[field] !== undefined) {
          const bValue = user[field] === true || user[field] === 'true' || user[field] === 1;
          this.AdduserForm.patchValue({ [field]: bValue });
        }
      });

      // Password is not required during edit
      this.AdduserForm.get('password')?.clearValidators();
      this.AdduserForm.get('password')?.updateValueAndValidity();
    } else {
      const sessionUserId = sessionStorage.getItem('userid');
      if (sessionUserId) {
        this.AdduserForm.patchValue({
          userID: Number(sessionUserId)
        });
      }
    }
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

      this.selectedFileName = file.name;
      this.selectedImageFile = file;
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

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  close() {
    this.route.navigate(['/usermanagement']);
  }

  saveUser() {
    if (this.AdduserForm.invalid) {
      this.AdduserForm.markAllAsTouched();
      this.toast.showError("Please fill all required fields correctly");
      return;
    }

    const formData = { ...this.AdduserForm.value };
    
    if (formData.dob) {
      formData.dob = new Date(formData.dob).toISOString();
    }
    if (formData.joinDate) {
      formData.joinDate = new Date(formData.joinDate).toISOString();
    }

    const apiCall = this.isEditMode 
      ? this.service.updateUser(formData) 
      : this.service.addUser(formData);

    apiCall.subscribe({
      next: (res: any) => {
        if (res.status) {
          this.toast.showSuccess(res.message || (this.isEditMode ? "User updated successfully" : "User added successfully"));
          this.close();
        } else {
          this.toast.showError(res.message || "Failed to process request");
        }
      },
      error: (err) => {
        this.toast.showError("Something went wrong. Please try again.");
      }
    });
  }
}
