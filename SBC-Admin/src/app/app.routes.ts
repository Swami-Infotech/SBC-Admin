import { Routes } from '@angular/router';
import { Sidebar } from './Component/sidebar/sidebar';
import { Dashboard } from './Component/dashboard/dashboard';

export const routes: Routes = [
    {
        path:"Sidebar",
        component:Sidebar
    },
    {
        path:"Dashboard",
        component:Dashboard
    }
];
