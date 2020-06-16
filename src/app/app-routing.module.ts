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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'living-persons', component: LivingPersonsComponent },
  { path: 'living-persons/view/:appId', component: ViewComponent },
  { path: 'living-persons/setstatus/:appId', component: SetstatusComponent },
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
  { path: 'living-persons/create', component: CreatePersonComponent },
  { path: 'add-family-member/:personId', component: AddFamilyMemberComponent },
  { path: 'add-category/:personId', component: AddCategoryComponent },
  { path: 'add-weapon/:personId', component: CreateWeaponComponent },
  { path: 'view-user-card', component: ViewUserCardComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
