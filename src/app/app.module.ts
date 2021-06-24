import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcesslistComponent } from './processlist/processlist.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { HomeComponent, LoginRutokenDialog } from './home/home.component';
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
import { ReportsComponent } from './reports/reports.component';
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
import { UnemployeeComponent, ViewAgreementDialog } from './steppers/unemployee/unemployee.component';
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
import { SafePipe } from './SafePipe';
import { DetailReportComponent } from './reports/detail-report/detail-report.component';
import { CreateWrongdoingComponent } from './customs/wrongdoing/create-wrongdoing/create-wrongdoing.component';
import { ViewWrongdoingComponent } from './customs/wrongdoing/view-wrongdoing/view-wrongdoing.component';
import { CreateCriminalEntryComponent } from './customs/criminal-entry/create-criminal-entry/create-criminal-entry.component';
import { ViewCriminalEntryComponent } from './customs/criminal-entry/view-criminal-entry/view-criminal-entry.component';
import { ViewRegistrationComponent } from './customs/registration/view-registration/view-registration.component';
import { CreateRegistrationComponent } from './customs/registration/create-registration/create-registration.component';
import { CreateCommunityRegistrationComponent } from './customs/community-registration/create-community-registration/create-community-registration.component';
import { ViewCommunityRegistrationComponent } from './customs/community-registration/view-community-registration/view-community-registration.component';
import { ViewIdentityCardComponent } from './customs/identity-card/view-identity-card/view-identity-card.component';
import { CreateIdentityCardComponent } from './customs/identity-card/create-identity-card/create-identity-card.component';
import { KoykaComponent, NewPatientDialog, OutPatientDialog, DeadPatientDialog } from './customs/koyka/koyka.component';
import { GeoreportComponent } from './reports/georeport/georeport.component';
import { ViewMapHistoryComponent } from './view-map-history/view-map-history.component';
import { MapItemComponent } from './view-map-history/map-item/map-item.component';
import { EditListTileDialog, EditTextDialog, ListViewWidgetComponent, NewListViewDialog, NewPageDialog, NewTextDialog } from './customs/flutter/list-view-widget/list-view-widget.component';
import { ViewSourceListComponent } from './report-builder/view-source-list/view-source-list.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddSourceConditionDialog, AddSubSourceDialog, ViewConstructorComponent } from './report-builder/view-constructor/view-constructor.component';
import { ViewAnaliticsComponent } from './view-analitics/view-analitics.component';
import { AddDealDialog, AddLicenseDialog, AddSupplierMemberDialog, ViewSupplierComponent } from './view-analitics/view-supplier/view-supplier.component';
import { ViewMsecDetailsDialog, ViewSupplierMembersComponent } from './view-analitics/view-supplier/view-supplier-members/view-supplier-members.component';
import { ViewSuppliersComponent } from './view-analitics/view-suppliers/view-suppliers.component';
import { ViewProcurementsComponent } from './view-analitics/view-procurements/view-procurements.component';
import { ViewProcurementDetailsComponent } from './view-analitics/view-procurements/view-procurement-details/view-procurement-details.component';
import { ViewTendersComponent } from './view-analitics/view-tenders/view-tenders.component';
import { ViewTenderDetailsComponent } from './view-analitics/view-tenders/view-tender-details/view-tender-details.component';
import { ViewSupplierAppealsComponent } from './view-analitics/view-supplier/view-supplier-appeals/view-supplier-appeals.component';
import { UploadSupplierListComponent } from './view-analitics/upload-supplier-list/upload-supplier-list.component';
import { ViewSupplierLicensesComponent } from './view-analitics/view-supplier/view-supplier-licenses/view-supplier-licenses.component';
import { ViewSupplierIpsComponent } from './view-analitics/view-supplier/view-supplier-ips/view-supplier-ips.component';
import { ViewSodUpdaterComponent } from './view-analitics/view-sod-updater/view-sod-updater.component';
import { ViewAuditSectionComponent } from './view-analitics/view-audit-section/view-audit-section.component';
import { AddCheckboxConditionDialog, AddDateConditionDialog, AddSelectConditionDialog, AddTextConditionDialog, ViewReportConditionsComponent } from './report-builder/view-constructor/view-report-conditions/view-report-conditions.component';
import { ViewReportResultComponent } from './report-builder/view-constructor/view-report-result/view-report-result.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ViewReportItemFillerComponent } from './report-builder/view-constructor/view-report-item-filler/view-report-item-filler.component';
import { ViewReportUploaderComponent } from './report-builder/view-constructor/view-report-uploader/view-report-uploader.component';
import { ViewSupplierDebtsComponent } from './view-analitics/view-supplier/view-supplier-debts/view-supplier-debts.component';
import { ViewSupplierCrimesComponent } from './view-analitics/view-supplier/view-supplier-crimes/view-supplier-crimes.component';
import { ViewSupplierLitigationsComponent } from './view-analitics/view-supplier/view-supplier-litigations/view-supplier-litigations.component';
import { ViewPrivacySettingsComponent } from './view-analitics/view-privacy-settings/view-privacy-settings.component';
import { LocalGrantedSourcesComponent } from './view-analitics/view-privacy-settings/local-granted-sources/local-granted-sources.component';
import { ViewSchedulerComponent } from './view-analitics/view-scheduler/view-scheduler.component';
import { SchedulerService } from './view-analitics/scheduler/scheduler.service';
import { ServerResponseCode } from './view-analitics/scheduler/response.code.constants';
//export const options: Partial<IConfig> | (() => Partial<IConfig>);
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { TestFieldTestComponent } from './components/test-field-test/test-field-test.component';
import { AddKeycloakUserDialog, KeycloakUserManagerComponent } from './keycloak-user-manager/keycloak-user-manager.component';
import { RoleConstraintsComponent } from './view-analitics/view-privacy-settings/role-constraints/role-constraints.component';
import { ViewRolesComponent } from './view-analitics/view-privacy-settings/view-roles/view-roles.component';
import { SupplierAccountComponent } from './user-cabinets/supplier-account/supplier-account.component';
import { BuyerAccountComponent } from './user-cabinets/buyer-account/buyer-account.component';
import { SupplierInitialFormComponent } from './user-cabinets/supplier-account/supplier-initial-form/supplier-initial-form.component';
import { ViewSupplierDealsComponent } from './view-analitics/view-supplier/view-supplier-deals/view-supplier-deals.component';

export function initializeApp(appConfig: AppConfig, keycloak: KeycloakService) {
  return () => appConfig.load().then((k_obj) => keycloak.init({
    config: {
      url: k_obj.host_keycloak + 'auth',
      realm: k_obj.realm,
      clientId: k_obj.clientId,
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
    },
  }));
}

@NgModule({
  declarations: [
    SafePipe,
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
    ReportsComponent,
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
    UnemployeeComponent,
    SetstatusComponent,
    ViewComponent,
    SodDataComponent,
    ViewAgreementDialog,
    MDataSearchDialog,
    NewPatientDialog,
    OutPatientDialog,
    DeadPatientDialog,
    CreatePersonComponent,
    LivingPersonsComponent,
    AddFamilyMemberComponent,
    AddCategoryComponent,
    ViewWeaponComponent,
    CreateWeaponComponent,
    ViewUserCardComponent,
    DetailReportComponent,
    CreateWrongdoingComponent,
    ViewWrongdoingComponent,
    CreateCriminalEntryComponent,
    ViewCriminalEntryComponent,
    ViewRegistrationComponent,
    CreateRegistrationComponent,
    CreateCommunityRegistrationComponent,
    ViewCommunityRegistrationComponent,
    ViewIdentityCardComponent,
    CreateIdentityCardComponent,
    KoykaComponent,
    GeoreportComponent,
    ViewMapHistoryComponent,
    MapItemComponent,
    ListViewWidgetComponent,
    AddTextConditionDialog,
    AddDateConditionDialog,
    AddCheckboxConditionDialog,
    AddSelectConditionDialog,
    NewListViewDialog,
    NewPageDialog,
    NewTextDialog,
    EditTextDialog,
    EditListTileDialog,
    ViewMsecDetailsDialog,
    ViewSourceListComponent,
    ViewConstructorComponent,
    ViewAnaliticsComponent,
    ViewSupplierComponent,
    ViewSupplierMembersComponent,
    ViewSuppliersComponent,
    ViewProcurementsComponent,
    ViewProcurementDetailsComponent,
    ViewTendersComponent,
    ViewTenderDetailsComponent,
    ViewSupplierAppealsComponent,
    UploadSupplierListComponent,
    ViewSupplierLicensesComponent,
    ViewSupplierIpsComponent,
    ViewSodUpdaterComponent,
    ViewAuditSectionComponent,
    ViewReportConditionsComponent,
    ViewReportResultComponent,
    ViewReportItemFillerComponent,
    ViewReportUploaderComponent,
    ViewSupplierDebtsComponent,
    ViewSupplierCrimesComponent,
    ViewSupplierLitigationsComponent,
    ViewPrivacySettingsComponent,
    LocalGrantedSourcesComponent,
    ViewSchedulerComponent,
    AddSubSourceDialog,
    AddSourceConditionDialog,
    AddKeycloakUserDialog,
    TestFieldTestComponent,
    KeycloakUserManagerComponent,
    LoginRutokenDialog,
    RoleConstraintsComponent,
    ViewRolesComponent,
    SupplierAccountComponent,
    BuyerAccountComponent,
    SupplierInitialFormComponent,
    AddSupplierMemberDialog,
    AddLicenseDialog,
    ViewSupplierDealsComponent,
    AddDealDialog
  ],
  imports: [
    KeycloakAngularModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LayoutModule,
    StorageServiceModule,
    LeafletModule.forRoot(),
    NgxMaskModule.forRoot(),
    DragDropModule,
    MatTableExporterModule
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig, KeycloakService], multi: true
    },
    /*{
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, AppConfig],
    },*/
    CamundaRestService,
    DataService,
    ServerResponseCode,
    SchedulerService,
    MaterialService,
    NavService,
    LocalStorageService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
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
    MDataSearchDialog,
    NewPatientDialog,
    OutPatientDialog,
    DeadPatientDialog,
    AddTextConditionDialog,
    AddDateConditionDialog,
    AddCheckboxConditionDialog,
    AddSelectConditionDialog,
    NewListViewDialog,
    NewPageDialog,
    NewTextDialog,
    EditTextDialog,
    EditListTileDialog,
    ViewMsecDetailsDialog,
    AddSubSourceDialog,
    AddSourceConditionDialog,
    AddKeycloakUserDialog,
    LoginRutokenDialog,
    AddSupplierMemberDialog,
    AddLicenseDialog,
    AddDealDialog
  ]
})
export class AppModule {
}
