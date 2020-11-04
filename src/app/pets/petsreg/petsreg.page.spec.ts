import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PetsregPage } from './petsreg.page';

describe('PetsregPage', () => {
  let component: PetsregPage;
  let fixture: ComponentFixture<PetsregPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetsregPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PetsregPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
