import { Routes } from '@angular/router';
import { StatisticComponent } from './pages/statistic/statistic.component';

export const routes: Routes = [
    { path: '', redirectTo: 'estadisticas', pathMatch: 'full' },
    { path: 'estadisticas', component: StatisticComponent },
    //{ path: 'informacion', loadChildren: () => import('./components/thematic-page/thematic.module').then(m => m.ThematicModule) },
    //{ path: 'informacion', loadChildren: () => import('./components/region-page/region.module').then(m => m.RegionModule) },
    { path: '**', redirectTo: 'estadisticas', pathMatch: 'full' },
];