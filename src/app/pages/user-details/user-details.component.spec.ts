import {ComponentFixture, TestBed} from '@angular/core/testing';
import { UserDetailsComponent } from './user-details.component';
import {UserService} from '../../services/user.service';
import {provideRouter, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {IUser} from '../../model/user.model';
import {ActivatedRoute} from '@angular/router';

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let fakeUserService: jasmine.SpyObj<UserService>;
  let router: Router;

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

  beforeEach(async () => {
    fakeUserService = jasmine.createSpyObj('UserService', ['getUserDetailsById']);
    fakeUserService.getUserDetailsById.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      imports: [UserDetailsComponent],
      providers: [
        {provide: UserService, useValue: fakeUserService},
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details on init', () => {
    expect(fakeUserService.getUserDetailsById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
  });

  it('should display user information in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.user-info')?.textContent).toContain(mockUser.username);
    expect(compiled.querySelector('.user-info')?.textContent).toContain(mockUser.email);
    expect(compiled.querySelector('.user-info')?.textContent).toContain(mockUser.phone);
    expect(compiled.querySelector('.user-info')?.textContent).toContain(mockUser.website);
  });

  it('should display address information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const addressSection = compiled.querySelectorAll('.info-section')[0];
    expect(addressSection?.textContent).toContain(mockUser.address.city);
    expect(addressSection?.textContent).toContain(mockUser.address.street);
    expect(addressSection?.textContent).toContain(mockUser.address.suite);
    expect(addressSection?.textContent).toContain(mockUser.address.zipcode);
    expect(addressSection?.textContent).toContain(mockUser.address.geo.lat);
    expect(addressSection?.textContent).toContain(mockUser.address.geo.lng);
  });

  it('should display company information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const companySection = compiled.querySelectorAll('.info-section')[1];
    expect(companySection?.textContent).toContain(mockUser.company.name);
    expect(companySection?.textContent).toContain(mockUser.company.catchPhrase);
    expect(companySection?.textContent).toContain(mockUser.company.bs);
  });

  it('should navigate back to users list', () => {
    spyOn(router, 'navigate');
    component.back();
    expect(router.navigate).toHaveBeenCalledWith(['/users']);
  });

});
