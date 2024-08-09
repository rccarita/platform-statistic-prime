import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { RegionPageComponent } from "./region-page.component";

export const REGION_ROUTES: Routes = [
    { path: 'inicio-regiones', component: HomeComponent },
    { path: 'regiones', component: RegionPageComponent },
]