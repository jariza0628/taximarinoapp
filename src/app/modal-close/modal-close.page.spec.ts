import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalClosePage } from './modal-close.page';

describe('ModalClosePage', () => {
  let component: ModalClosePage;
  let fixture: ComponentFixture<ModalClosePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalClosePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalClosePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
