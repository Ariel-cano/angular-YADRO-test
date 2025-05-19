import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IUser } from '../model/user.model';
import { provideHttpClient } from '@angular/common/http';
import {environment} from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
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
  const expectedUrl = environment.API_URL;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all Users', (done) => {

    service.getAllUsers().subscribe({
      next: (users) => {
        expect(users).toEqual([mockUser]);
        done();
      },
      error: (error) => {
        fail(error);
        done();
      }
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockUser]);
  });

  it('should get User details by id', (done) => {

    service.getUserDetailsById(1).subscribe({
      next: (user) => {
        expect(user).toEqual(mockUser);
        done()
      },
      error: (err) => {
        fail(err);
        done();
      }
    })
    const req = httpMock.expectOne(`${expectedUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should create user', (done) => {

    service.createUser(mockUser).subscribe({
      next: (result) => {
        expect(result).toEqual(mockUser);
        done();
      },
      error: (err) => {
        fail(err);
        done();
      }
    })
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it('should update user', (done) => {

    service.updateUser(mockUser, 1).subscribe({
      next: (result) => {
        expect(result).toEqual(mockUser);
        done();
      },
      error: (err) => {
        fail(err);
        done();
      }
    })
    const req = httpMock.expectOne(`${expectedUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    req.flush(mockUser);
  });

  it ('should delete user', (done) => {

    service.deleteUser(1).subscribe({
      next: (result) => {
        expect(result).toEqual({});
        done();
      },
      error: (err) => {
        fail(err);
        done();
      }
    });

    const req = httpMock.expectOne(`${expectedUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle error on getAllUsers', (done) => {
    service.getAllUsers().subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      }
    });
    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error loading users', { status: 500, statusText: 'Server Error' });
  });

});
