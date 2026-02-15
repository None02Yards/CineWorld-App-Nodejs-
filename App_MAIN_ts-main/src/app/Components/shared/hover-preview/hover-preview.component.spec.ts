import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverPreviewComponent } from './hover-preview.component';

describe('HoverPreviewComponent', () => {
  let component: HoverPreviewComponent;
  let fixture: ComponentFixture<HoverPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoverPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoverPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
