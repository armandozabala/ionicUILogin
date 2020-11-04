import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PetsregPageRoutingModule } from './petsreg-routing.module';

import { PetsregPage } from './petsreg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PetsregPageRoutingModule
  ],
  declarations: [PetsregPage]
})
export class PetsregPageModule {}
