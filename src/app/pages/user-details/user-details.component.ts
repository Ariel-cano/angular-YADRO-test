import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    NzDescriptionsModule,
    NzCardModule,
    NzAvatarModule,
    NzButtonModule
  ],
  templateUrl: './user-details.component.html',
  standalone: true,
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  userSrc = inject(UserService);
  user: IUser | null = null;

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.userSrc.getUserDetailsById(userId).subscribe({
        next: (user: IUser) => {
          this.user = user;
        },
        error: (err: Error) => {
          alert(`Error loading user details: ${err}`);
        }
      });
    }
  }
  back(): void {
    this.router.navigate(['/users'])
  }
}
