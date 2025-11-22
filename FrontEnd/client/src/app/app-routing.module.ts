import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { StocksListComponent } from './components/stocks-list/stocks-list.component';
import { ReserveComponent } from './components/reserve/reserve.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ReleaseComponent } from './components/release/release.component';

const routes: Routes = [
  { path: '', component: BulkUploadComponent },          
  { path: 'availability', component: AvailabilityComponent },
  { path: 'stocks', component: StocksListComponent },   
    { path: 'reserve', component: ReserveComponent }, 
      { path: 'confirm', component: ConfirmComponent },
      { path: 'release', component: ReleaseComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
