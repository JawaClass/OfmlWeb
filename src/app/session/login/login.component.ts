import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  dialogRef = inject(MatDialogRef<LoginComponent>)
  userService = inject(UserService)

  loginForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9_\. ]{2,40}@koenig-neurath.de$/)])
  })

  async signup() {
    const email = this.loginForm.get("email")!!.value!!
    await this.userService.signinOrSignUpUserByEmail(email)
    this.dialogRef.close({
      email: email
    })
  }

}
