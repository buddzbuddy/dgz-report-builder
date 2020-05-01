import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProcesslistComponent } from './processlist/processlist.component';
import { StartProcessComponent } from './start-process/start-process.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { ResourcesComponent } from './resources/resources.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReportComponent } from './report/report.component';
import { ViewItemComponent } from './resources/view-item/view-item.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { FilesComponent } from './files/files.component';
import { VideoplayerComponent } from './videoplayer/videoplayer.component';
import { UnemployeeComponent } from './steppers/unemployee/unemployee.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
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
  { path: 'report', component: ReportComponent },
  { path: 'bookmarks', component: BookmarkComponent },
  { path: 'upload-image', component: UploadImageComponent },
  { path: 'fileList', component: FilesComponent },
  { path: 'videoplayer', component: VideoplayerComponent },
  { path: 'steppers/unemployee', component: UnemployeeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
