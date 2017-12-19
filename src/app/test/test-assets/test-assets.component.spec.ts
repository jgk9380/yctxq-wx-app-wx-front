import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAssetsComponent } from './test-assets.component';

describe('TestAssetsComponent', () => {
  let component: TestAssetsComponent;
  let fixture: ComponentFixture<TestAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
