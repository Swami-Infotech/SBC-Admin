import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SBC } from '../../Service/sbc';
import { ToastrNotificationService } from '../../Common/toastr-notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginObj: any = {
    email: '',
    password: ''
  };
  LoginForm!:FormGroup;

  constructor(private service:SBC,private toast:ToastrNotificationService,private fb:FormBuilder,
    private router:Router
  ){
    this.LoginForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    const payload = {
      email: this.LoginForm.value.email,
      password: this.LoginForm.value.password
    }
    this.service.Login(payload).subscribe(
      (resp:any)=>{
        if(resp.status){
          this.toast.showSuccess(resp.message);
          sessionStorage.setItem('userid',resp.data.userID);
          sessionStorage.setItem('token',resp.data.token);
          this.router.navigate(['/Dashboard']);
        }
      }
    )
  }

}
