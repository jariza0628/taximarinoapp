import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailScanPage } from './detail-scan.page';

describe('DetailScanPage', () => {
  let component: DetailScanPage;
  let fixture: ComponentFixture<DetailScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailScanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
