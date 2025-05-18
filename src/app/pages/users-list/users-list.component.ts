import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {IUser} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {debounceTime, distinctUntilChanged, Subject, Subscription, switchMap} from 'rxjs';
import * as console from 'node:console';

@Component({
  selector: 'app-users-list',
  imports: [],
  templateUrl: './users-list.component.html',
  standalone: true,
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit , OnDestroy {
  users : IUser[] = [];
  filteredUsers: IUser[] = [];
  userSrc = inject(UserService);
  private subscriptions: Subscription[] = [];
  searchTerm: string = '';
  searchTerms: Subject<string> = new Subject<string>();


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
  }

  onSearch(term: string) {
    this.searchTerms.next(term);
  }



  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }





}
