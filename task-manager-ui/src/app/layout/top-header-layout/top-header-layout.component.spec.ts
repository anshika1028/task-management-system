import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHeaderLayoutComponent } from './top-header-layout.component';

describe('TopHeaderLayoutComponent', () => {
  let component: TopHeaderLayoutComponent;
  let fixture: ComponentFixture<TopHeaderLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopHeaderLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopHeaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
