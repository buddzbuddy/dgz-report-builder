import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProcesslistComponent } from './processlist/processlist.component';
import { StartProcessComponent } from './start-process/start-process.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { ResourcesComponent } from './resources/resources.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReportsComponent } from './reports/reports.component';
import { ViewItemComponent } from './resources/view-item/view-item.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { FilesComponent } from './files/files.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { SetstatusComponent } from './customs/living-persons/setstatus/setstatus.component';
import { ViewComponent } from './customs/living-persons/view/view.component';
import { CreatePersonComponent } from './steppers/create-person/create-person.component';
import { LivingPersonsComponent } from './customs/living-persons/living-persons.component';
import { AddFamilyMemberComponent } from './customs/add-family-member/add-family-member.component';
import { AddCategoryComponent } from './customs/add-category/add-category.component';
import { CreateWeaponComponent } from './customs/weapon/create-weapon/create-weapon.component';
import { ViewUserCardComponent } from './customs/user-card/view-user-card/view-user-card.component';
import { DetailReportComponent } from './reports/detail-report/detail-report.component';
import { CreateWrongdoingComponent } from './customs/wrongdoing/create-wrongdoing/create-wrongdoing.component';
import { CreateCriminalEntryComponent } from './customs/criminal-entry/create-criminal-entry/create-criminal-entry.component';
import { CreateRegistrationComponent } from './customs/registration/create-registration/create-registration.component';
import { CreateCommunityRegistrationComponent } from './customs/community-registration/create-community-registration/create-community-registration.component';
import { CreateIdentityCardComponent } from './customs/identity-card/create-identity-card/create-identity-card.component';
import { KoykaComponent } from './customs/koyka/koyka.component';
import { GeoreportComponent } from './reports/georeport/georeport.component';
import { ViewMapHistoryComponent } from './view-map-history/view-map-history.component';
import { ListViewWidgetComponent } from './customs/flutter/list-view-widget/list-view-widget.component';
import { ViewSourceListComponent } from './report-builder/view-source-list/view-source-list.component';
import { ViewConstructorComponent } from './report-builder/view-constructor/view-constructor.component';
import { ViewSupplierComponent } from './view-analitics/view-supplier/view-supplier.component';
import { ViewAnaliticsComponent } from './view-analitics/view-analitics.component';
import { UploadSupplierListComponent } from './view-analitics/upload-supplier-list/upload-supplier-list.component';
import { ViewSodUpdaterComponent } from './view-analitics/view-sod-updater/view-sod-updater.component';
import { ViewAuditSectionComponent } from './view-analitics/view-audit-section/view-audit-section.component';
import { ViewPrivacySettingsComponent } from './view-analitics/view-privacy-settings/view-privacy-settings.component';
import { ViewSchedulerComponent } from './view-analitics/view-scheduler/view-scheduler.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'persons', component: LivingPersonsComponent },
  { path: 'persons/view/:appId', component: ViewComponent },
  { path: 'persons/setstatus/:appId', component: SetstatusComponent },
  { path: 'processlist', component: ProcesslistComponent },
  { path: 'startprocess/:processdefinitionkey', component: StartProcessComponent },
  { path: 'startprocess/:processdefinitionkey/:templateId/:resourceItemId', component: StartProcessComponent },
  { path: 'tasklist', component: TasklistComponent },
  { path: 'tasklist/:id', component: TasklistComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'resources/:templateId', component: ResourcesComponent },
  { path: 'resources/:templateId/viewItem/:resourceItemId', component: ViewItemComponent },
  { path: 'filteredResources/:templateId/:bookmarkId', component: ResourcesComponent },
  { path: 'monitor', component: MonitorComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'reports/detail-report', component: DetailReportComponent },
  { path: 'bookmarks', component: BookmarkComponent },
  { path: 'upload-image', component: UploadImageComponent },
  { path: 'fileList', component: FilesComponent },
  { path: 'videoplayer', component: VideoplayerComponent },
  { path: 'persons/create', component: CreatePersonComponent },
  { path: 'add-family-member/:personId', component: AddFamilyMemberComponent },
  { path: 'add-category/:personId', component: AddCategoryComponent },
  { path: 'add-weapon/:personId', component: CreateWeaponComponent },
  { path: 'add-wrongdoing/:personId', component: CreateWrongdoingComponent },
  { path: 'add-criminal-entry/:personId', component: CreateCriminalEntryComponent },
  { path: 'add-registration/:personId', component: CreateRegistrationComponent },
  { path: 'add-community-registration/:personId', component: CreateCommunityRegistrationComponent },
  { path: 'add-identity-card/:personId', component: CreateIdentityCardComponent },
  { path: 'view-user-card', component: ViewUserCardComponent },
  { path: 'koyka', component: KoykaComponent },
  { path: 'reports/georeport', component: GeoreportComponent },
  { path: 'view-map-history/:appUserId', component: ViewMapHistoryComponent },
  { path: 'flutter/list-view-widget/:routeData', component: ListViewWidgetComponent },
  { path: 'report-builder/view-source-list', component: ViewSourceListComponent },
  { path: 'report-builder/view-constructor/:className', component: ViewConstructorComponent },
  { path: 'analitics', component: ViewAnaliticsComponent },
  { path: 'analitics/view-supplier/:supplierId', component: ViewSupplierComponent },
  { path: 'analitics/upload-supplier-list', component: UploadSupplierListComponent },
  { path: 'analitics/view-sod-updater', component: ViewSodUpdaterComponent },
  { path: 'analitics/view-audit-section', component: ViewAuditSectionComponent },
  { path: 'analitics/view-privacy-settings', component: ViewPrivacySettingsComponent },
  { path: 'analitics/view-scheduler', component: ViewSchedulerComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
