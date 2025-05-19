import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NgIf} from '@angular/common';
import {IUser} from '../../model/user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzIconDirective} from 'ng-zorro-antd/icon';

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
    NgIf,
  ],
  templateUrl: './user-form.component.html',
  standalone: true,
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit{
  userForm: FormGroup = new FormGroup({});
  userSrc = inject(UserService)
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  isEditMode: boolean = false;

  constructor() {
    this.initializeForm();
  }



  initializeForm(): void {
    this.userForm = new FormGroup({
      id: new FormControl(Math.floor(Math.random() * 1000)),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      street: new FormControl('', [Validators.required]),
      suite: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      lat: new FormControl('', [Validators.required]),
      lng: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      catchPhrase: new FormControl('', [Validators.required]),
      bs: new FormControl('', [Validators.required]),
    })
  }
  ngOnInit(): void {
    this.checkEditMode();
  }


  private checkEditMode(): void {
    const userId = this.route.snapshot.params['id'];
    if (userId){
      this.isEditMode = true;
      this.loadUserData(+userId)
    }
  }

  private loadUserData(userId: number): void {
    this.userSrc.getUserDetailsById(userId).subscribe({
      next: (user: IUser) => {
        this.patchFormWithUserData(user);
      },
      error: (err) => {
        alert(`Error loading user: ${err}`);
      }
    })
  }

  private patchFormWithUserData(user: IUser): void {
    this.userForm.patchValue({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
      street: user.address.street,
      suite: user.address.suite,
      city: user.address.city,
      zipcode: user.address.zipcode,
      lat: user.address.geo.lat,
      lng: user.address.geo.lng,
      companyName: user.company.name,
      catchPhrase: user.company.catchPhrase,
      bs: user.company.bs
    })
  }

  private prepareUserData(): IUser {
    const formValue = this.userForm.value;
    return {
      ...formValue,
      address: {
        street: formValue.street,
        suite: formValue.suite,
        city: formValue.city,
        zipcode: formValue.zipcode,
        geo: {
          lat: formValue.lat,
          lng: formValue.lng
        }
      },
      company: {
        name: formValue.companyName,
        catchPhrase: formValue.catchPhrase,
        bs: formValue.bs
      }
    };
  }



  onSubmit(): void {

    const userData = this.prepareUserData();

    if (this.isEditMode) {
      this.updateUser(userData);
    } else {
      this.createUser(userData);
    }
  }

  private updateUser(userData: IUser): void {
    this.userSrc.updateUser(userData, userData.id).subscribe({
      next: (res: IUser) => {
        alert(`User ${res.name} updated successfully!`);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user. Try again later.');
      }
    });
  }

  private createUser(userData: IUser): void {
    this.userSrc.createUser(userData).subscribe({
      next: (res: IUser) => {
        alert(`User ${res.name} created successfully!`);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error creating user:', err);
        alert('Failed to create user. Try again later.');
      }
    });
  }

  back(): void {
    this.router.navigate(['/users'])
  }





}
