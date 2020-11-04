import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PetsregPage } from './petsreg.page';

const routes: Routes = [
  {
    path: '',
    component: PetsregPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsregPageRoutingModule {}
