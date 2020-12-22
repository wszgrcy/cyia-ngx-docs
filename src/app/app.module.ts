import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarModule } from './layout/toolbar/toolbar.module';
import { MainModule } from './layout/main/main.module';
import { StoreModule } from '@ngrx/store';
import { codeHighlightReducer, leftSidenavReducer } from '@rxreducers';
import { navigationReducer } from '@rxreducers';
import { routerDataReducer } from '@rxreducers';
import { docRendererReducer } from '@rxreducers';
import { CyiaRepositoryModule } from 'cyia-ngx-common/repository';
import { catalogReducer } from '@rxreducers';
import { MatButtonModule } from '@angular/material/button';
import { CyiaMonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';
@NgModule({
  declarations: [AppComponent],
  imports: [
    CyiaMonacoTextmateModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    ToolbarModule,
    MainModule,
    CyiaRepositoryModule,
    MatButtonModule,
    StoreModule.forRoot(
      {
        leftSidenav: leftSidenavReducer,
        navigation: navigationReducer,
        routerData: routerDataReducer,
        docRenderer: docRendererReducer,
        catalog: catalogReducer,
        codeHighlight: codeHighlightReducer,
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
