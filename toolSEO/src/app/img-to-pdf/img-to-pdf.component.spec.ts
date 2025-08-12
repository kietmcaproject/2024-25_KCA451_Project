import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgToPdfComponent } from './img-to-pdf.component';

describe('ImgToPdfComponent', () => {
  let component: ImgToPdfComponent;
  let fixture: ComponentFixture<ImgToPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgToPdfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgToPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
