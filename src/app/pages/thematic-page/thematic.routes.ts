import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ThematicPageComponent } from "./thematic-page.component";

export const THEMATIC_ROUTES: Routes = [
    { path: 'inicio-tematicas', component: HomeComponent },
    { path: 'tematicas', component: ThematicPageComponent },
]