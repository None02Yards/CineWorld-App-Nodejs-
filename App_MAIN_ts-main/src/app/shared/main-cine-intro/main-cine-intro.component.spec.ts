import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCineIntroComponent } from './main-cine-intro.component';

describe('MainCineIntroComponent', () => {
  let component: MainCineIntroComponent;
  let fixture: ComponentFixture<MainCineIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainCineIntroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCineIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
