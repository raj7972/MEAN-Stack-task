import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BulkUploadComponent } from './components/bulk-upload/bulk-upload.component';
import { BulkStatusComponent } from './components/bulk-status/bulk-status.component';
import { AvailabilityComponent } from './components/availability/availability.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StocksListComponent } from './components/stocks-list/stocks-list.component';
import { ReserveComponent } from './components/reserve/reserve.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ReleaseComponent } from './components/release/release.component';

@NgModule({
  declarations: [
    AppComponent,
    BulkUploadComponent,
    BulkStatusComponent,
    AvailabilityComponent,
    BulkUploadComponent,
    AvailabilityComponent,
    StocksListComponent,
    ReserveComponent,
    ConfirmComponent,
    ReleaseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
