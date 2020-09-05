import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: '', loadChildren: './home/home.module#HomePageModule' },
  { path: 'detail-scan', loadChildren: './detail-scan/detail-scan.module#DetailScanPageModule' },
 ];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
