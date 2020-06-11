import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcesslistComponent } from './processlist/processlist.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { HomeComponent } from './home/home.component';
import { StartProcessComponent } from './start-process/start-process.component';
import { GenericForm } from './generic-form.component';
import { CamundaRestService } from './camunda-rest.service';
import { ResourcesComponent } from './resources/resources.component';
import { MaterialModule } from './material.module';
import { DataService } from './data.service';
import { MaterialService } from './material.service';
import { EntityformComponent } from './material/entity-form/entity-form.component';

import { InputComponent } from "./components/input/input.component";
import { ButtonComponent } from "./components/button/button.component";
import { SelectComponent } from "./components/select/select.component";
import { MultiSelectComponent } from "./components/multiselect/multiselect.component";
import { DateComponent } from "./components/date/date.component";
import { RadiobuttonComponent } from "./components/radiobutton/radiobutton.component";
import { CheckboxComponent } from "./components/checkbox/checkbox.component";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SelectGridComponent } from './grid/select-grid.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { NavService } from './nav.service';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { LocalStorageService } from './local-storage.service';
import { TaskFormComponent } from './material/task-form/task-form.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReportComponent } from './report/report.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletCoreComponent } from './leaflet/leaflet-core/leaflet-core.component';
import { LeafletEventsComponent } from './leaflet/leaflet-events/leaflet-events.component';
import { BaselayersComponent } from './leaflet/layers/baselayers/baselayers.component';
import { LayersComponent } from './leaflet/layers/layers/layers.component';
import { MarkersComponent } from './leaflet/layers/markers/markers.component';
import { NgforLayersComponent } from './leaflet/layers/ngfor-layers/ngfor-layers.component';
import { PerformanceComponent } from './leaflet/performance/performance.component';
import { LeafletWrapperComponent } from './leaflet/performance/leaflet-wrapper/leaflet-wrapper.component';
import { ViewItemComponent } from './resources/view-item/view-item.component';
import { MultiSelectFormComponent } from './grid/multi-select-form/multi-select-form.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { FilesComponent } from './files/files.component';
import { ImageComponent } from './components/image/image.component';
import { PreviewFileComponent } from './components/preview-file/preview-file.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { VgCoreModule } from 'videogular2/compiled/core';
import {VgControlsModule} from 'videogular2/compiled/controls';
import {VgOverlayPlayModule} from 'videogular2/compiled/overlay-play';
import {VgBufferingModule} from 'videogular2/compiled/buffering';
import { UnemployeeComponent, ViewAgreementDialog } from './steppers/unemployee/unemployee.component';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';
import { SetstatusComponent } from './customs/living-persons/setstatus/setstatus.component';
import { ViewComponent } from './customs/living-persons/view/view.component';
import { SodDataComponent } from './customs/living-persons/sod-data/sod-data.component';
import { CreatePersonComponent, MDataSearchDialog } from './steppers/create-person/create-person.component';
import { LivingPersonsComponent } from './customs/living-persons/living-persons.component';
import { AddFamilyMemberComponent } from './customs/add-family-member/add-family-member.component';
import { AddCategoryComponent } from './customs/add-category/add-category.component';
import { ViewWeaponComponent } from './customs/weapon/view-weapon/view-weapon.component';
import { CreateWeaponComponent } from './customs/weapon/create-weapon/create-weapon.component';
import { ViewUserCardComponent } from './customs/user-card/view-user-card/view-user-card.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'

//export const options: Partial<IConfig> | (() => Partial<IConfig>);


export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ProcesslistComponent,
    TasklistComponent,
    HomeComponent,
    StartProcessComponent,
    GenericForm,
    ResourcesComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    MultiSelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    SelectGridComponent,
    MainNavComponent,
    MenuListItemComponent,
    MonitorComponent,
    ReportComponent,
    LeafletCoreComponent,
    LeafletEventsComponent,
    BaselayersComponent,
    LayersComponent,
    MarkersComponent,
    NgforLayersComponent,
    PerformanceComponent,
    LeafletWrapperComponent,
    ViewItemComponent,
    MultiSelectFormComponent,
    BookmarkComponent,
    UploadImageComponent,
    FilesComponent,
    ImageComponent,
    PreviewFileComponent,
    VideoplayerComponent,
    UnemployeeComponent,
    SetstatusComponent,
    ViewComponent,
    SodDataComponent,
    ViewAgreementDialog,
    MDataSearchDialog,
    CreatePersonComponent,
    LivingPersonsComponent,
    AddFamilyMemberComponent,
    AddCategoryComponent,
    ViewWeaponComponent,
    CreateWeaponComponent,
    ViewUserCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
          allowedUrls: ['http://localhost:5001/api/identity', 'http://localhost:5001/api/content'],
          sendAccessToken: true
      }
  }),
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    StorageServiceModule,
    LeafletModule.forRoot(),
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true },
    CamundaRestService,
    DataService,
    MaterialService,
    NavService,
    LocalStorageService,
    OAuthService
  ],
  bootstrap: [AppComponent],
  entryComponents:[
    EntityformComponent,
    TaskFormComponent,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    MultiSelectComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    SelectGridComponent,
    MultiSelectFormComponent,
    ImageComponent,
    PreviewFileComponent,
    ViewAgreementDialog,
    MDataSearchDialog
  ]
})
export class AppModule {
 }
