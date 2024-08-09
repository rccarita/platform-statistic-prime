import { Routes } from '@angular/router';
import { StatisticComponent } from './pages/statistic/statistic.component';

export const routes: Routes = [
    { path: '', redirectTo: 'estadisticas', pathMatch: 'full' },
    { path: 'estadisticas', component: StatisticComponent },
    {
        path: 'informacion',
        loadChildren: () => import('./pages/thematic-page/thematic.routes').then(m => m.THEMATIC_ROUTES)
    },
    {
        path: 'informacion',
        loadChildren: () => import('./pages/region-page/region.routes').then(m => m.REGION_ROUTES)
    },
    { path: '**', redirectTo: 'estadisticas', pathMatch: 'full' },
];  