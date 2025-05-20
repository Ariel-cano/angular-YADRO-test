import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../../model/user.model';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  const mockUsers: IUser[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'john',
      email: 'john@example.com',
      phone: '',
      website: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: { lat: '', lng: '' }
      },
      company: { name: '', catchPhrase: '', bs: '' }
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'jane',
      email: 'jane@example.com',
      phone: '',
      website: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: { lat: '', lng: '' }
      },
      company: { name: '', catchPhrase: '', bs: '' }
    }
  ];

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers', 'deleteUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UsersListComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    mockUserService.getAllUsers.and.returnValue(of(mockUsers));
    fixture.detectChanges();

    expect(mockUserService.getAllUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(2);
    expect(component.filteredUsers.length).toBe(2);
  });

  it('should filter users by search term', () => {
    mockUserService.getAllUsers.and.returnValue(of(mockUsers));
    fixture.detectChanges();

    component.onSearch('jane');
    component.searchTerm = 'jane';
    component.users = mockUsers;
    component.filterUsers();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Jane Smith');
  });

  it('should navigate to edit page', () => {
    const user: IUser = mockUsers[0];
    component.onEdit(user);
    expect(router.navigate).toHaveBeenCalledWith(['/users', user.id, 'edit']);
  });

  it('should delete a user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockUserService.getAllUsers.and.returnValue(of(mockUsers));
    mockUserService.deleteUser.and.returnValue(of({}));
    fixture.detectChanges();

    component.onDelete(1);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });
});
