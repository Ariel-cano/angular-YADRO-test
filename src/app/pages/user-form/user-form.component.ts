import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NgIf} from '@angular/common';
import {IUser} from '../../model/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    NzFormItemComponent,
    NzFormLabelComponent,
    ReactiveFormsModule,
    NzFormDirective,
    NzInputDirective,
    NzButtonComponent,
    NzRowDirective,
    NzColDirective,
    NgIf
  ],
  templateUrl: './user-form.component.html',
  standalone: true,
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  userForm: FormGroup = new FormGroup({});
  userSrc = inject(UserService)

  constructor() {
    this.initializeForm();
  }



  initializeForm(): void {
    this.userForm = new FormGroup({
      id: new FormControl(Math.floor(Math.random() * 1000)),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      street: new FormControl('', [Validators.required]),
      suite: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(16)]),
      website: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      catchPhrase: new FormControl('', [Validators.required]),
      bs: new FormControl('', [Validators.required]),
    })
  }


  onSubmit(): void {
    const  userFormValue = this.userForm.value;
    this.userSrc.createUser(userFormValue).subscribe({
      next: (res: IUser) => {
        alert(`User ${res.name} create successfully!`);
      },
      error: (err) => {
        console.error('Error by create user:', err);
        alert('Failed to create a user. Try again later.');
      }
    });
  }
}
