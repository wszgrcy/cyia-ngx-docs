import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarModule } from './layout/toolbar/toolbar.module';
import { MainModule } from './layout/main/main.module';
import { StoreModule } from '@ngrx/store';
import { leftSidenavReducer } from '@rxreducer/left-sidenav.reducer';
import { navigationReducer } from '@rxreducer/navigation.reducer';
import { routerDataReducer } from '@rxreducer/router-data.reducer';
import { CyiaRepositoryModule } from 'cyia-ngx-common/repository';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToolbarModule,
    MainModule,
    CyiaRepositoryModule,
    StoreModule.forRoot(
      {
        leftSidenav: leftSidenavReducer,
        navigation: navigationReducer,
        routerData: routerDataReducer,
      },
      {
        runtimeChecks: {
          strictActionImmutability: false,
          strictStateImmutability: false,
        },
      }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
