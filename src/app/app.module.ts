import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarModule } from './layout/toolbar/toolbar.module';
import { MainModule } from './layout/main/main.module';
import { StoreModule } from '@ngrx/store';
import { CyiaRepositoryModule } from 'cyia-ngx-common/repository';
import { MatButtonModule } from '@angular/material/button';
import { CyiaMonacoTextmateModule } from 'cyia-ngx-common/monaco-textmate';
import { StoreService } from './store/store.service';
import { CodeHighlightStore } from './store/class/code-highlight.store';
import { NavigationStore } from './store/class/navigation.store';
import { CatalogStore } from './store/class/catalog.store';
import { RouterDataStore } from './store/class/router-data.store';
import { LeftSidenavStore } from './store/class';
import { DocRendererStore } from './store/class/doc-renderer.store';
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
      StoreService.getReducerMap([CodeHighlightStore, NavigationStore, CatalogStore, RouterDataStore, LeftSidenavStore, DocRendererStore]),
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
