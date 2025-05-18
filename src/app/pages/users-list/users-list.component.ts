import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IUser} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription, switchMap} from 'rxjs';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-list',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzInputModule,
    NzPaginationModule,
    NzButtonComponent
  ],
  templateUrl: './users-list.component.html',
  standalone: true,
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  userSrc = inject(UserService);
  private router = inject(Router);
  private subscriptions: Subscription[] = [];
  searchTerm: string = '';
  searchTerms: Subject<string> = new Subject<string>();

  pageSize: number = 4;
  currentPage: number = 1;
  totalItems: number = 0;

  ngOnInit() {
    this.loadUsers();

    const searchSubscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        this.searchTerm = term;
        return this.userSrc.getAllUsers();
      })
    ).subscribe({
      next: users => {
        this.users = users;
        this.filterUsers();
      },
      error: error => {
        console.error('Error by search users', error);
      }
    });

    this.subscriptions.push(searchSubscription);
  }

  loadUsers() {
    const loadSubscription = this.userSrc.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.filterUsers();
      },
      error: error => {
        console.error('Error by loading users:', error);
      }
    });

    this.subscriptions.push(loadSubscription);
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.totalItems = this.filteredUsers.length;
  }

  onSearch(term: string) {
    this.searchTerms.next(term);
  }

  onEdit(user: IUser) {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  onDelete(id: number) {
    const IsDelete = confirm('are you sure you want to delete this user?')
    if (IsDelete) {
      this.userSrc.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          this.filterUsers();
        },
        error: error => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  onPageIndexChange(page: number): void {
    this.currentPage = page;
  }

  getCurrentPageUsers(): IUser[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  goToUserDetails(id: number) {
    this.router.navigate([`/users`, id]);
  }
}
