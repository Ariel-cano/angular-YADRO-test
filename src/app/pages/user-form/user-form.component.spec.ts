import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IUser } from '../../model/user.model';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let fakeUserService: jasmine.SpyObj<UserService>;
  let router: Router;
  let route: ActivatedRoute;

  const mockUser: IUser = {
    id: 1,
    name: "Leanne Graham",
    username: "Bret",
    email: "Sincere@april.biz",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Gwenborough",
      zipcode: "92998-3874",
      geo: {
        lat: "-37.3159",
        lng: "81.1496"
      }
    },
    phone: "1-770-736-8031 x56442",
    website: "hildegard.org",
    company: {
      name: "Romaguera-Crona",
      catchPhrase: "Multi-layered client-server neural-net",
      bs: "harness real-time e-markets"
    }
  };

  const formData = {
    name: 'Test User',
    username: 'testuser',
    email: 'test@test.com',
    phone: '1234567890',
    website: 'test.com',
    street: 'Test Street',
    suite: 'Test Suite',
    city: 'Test City',
    zipcode: '12345',
    lat: '0',
    lng: '0',
    companyName: 'Test Company',
    catchPhrase: 'Test Phrase',
    bs: 'Test BS'
  };

  const createUserResponse = (data: typeof formData, id?: number): IUser => ({
    ...mockUser,
    ...data,
    id: id || mockUser.id,
    address: {
      street: data.street,
      suite: data.suite,
      city: data.city,
      zipcode: data.zipcode,
      geo: {
        lat: data.lat,
        lng: data.lng
      }
    },
    company: {
      name: data.companyName,
      catchPhrase: data.catchPhrase,
      bs: data.bs
    }
  });

  beforeEach(async () => {
    fakeUserService = jasmine.createSpyObj('UserService',
      ['getUserDetailsById', 'createUser', 'updateUser']);

    fakeUserService.getUserDetailsById.and.returnValue(of(mockUser));
    fakeUserService.createUser.and.returnValue(of(createUserResponse(formData)));
    fakeUserService.updateUser.and.returnValue(of(createUserResponse(formData, 1)));

    await TestBed.configureTestingModule({
      imports: [UserFormComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: fakeUserService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('username')?.value).toBe('');
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      route.snapshot.params = { id: '1' };
      component.ngOnInit();
    });

    it('should load user data', () => {
      expect(fakeUserService.getUserDetailsById).toHaveBeenCalledWith(1);
      expect(component.isEditMode).toBeTrue();
    });

    it('should update user on submit', () => {
      spyOn(router, 'navigate');
      spyOn(window, 'alert');

      component.userForm.patchValue(formData);
      component.onSubmit();

      expect(fakeUserService.updateUser).toHaveBeenCalledWith(
        jasmine.objectContaining({ name: formData.name }),
        1
      );
      expect(window.alert).toHaveBeenCalledWith(
        `User ${formData.name} updated successfully!`
      );
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  describe('Create Mode', () => {
    it('should create new user on submit', () => {
      spyOn(router, 'navigate');
      spyOn(window, 'alert');

      component.userForm.patchValue(formData);
      component.onSubmit();

      expect(fakeUserService.createUser).toHaveBeenCalledWith(
        jasmine.objectContaining({ name: formData.name })
      );
      expect(window.alert).toHaveBeenCalledWith(
        `User ${formData.name} created successfully!`
      );
      expect(router.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  it('should navigate back to users list', () => {
    spyOn(router, 'navigate');
    component.back();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });
});
