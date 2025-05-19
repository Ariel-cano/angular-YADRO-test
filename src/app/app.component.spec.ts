import {ComponentFixture, TestBed} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {provideRouter, RouterOutlet} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'angular-Yadro-task' title`, () => {
    expect(component.title).toEqual('angular-Yadro-task');
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular Yadro Test task');
  });

  it('should have "Users List" link', ()=>{
    const link = fixture.debugElement.query(By.css('a[routerLink="users"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Users List');
  });

  it('should have "Create new User" link', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="users/new"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Create new User');
  });

  it('should have router-outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });


});
