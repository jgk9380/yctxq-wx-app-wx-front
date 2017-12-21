import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeveloperComponent } from './user-developer.component';

describe('UserDeveloperComponent', () => {
  let component: UserDeveloperComponent;
  let fixture: ComponentFixture<UserDeveloperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeveloperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeveloperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
