import { Routes } from '@angular/router';
import { Sidebar } from './Component/sidebar/sidebar';
import { Dashboard } from './Component/dashboard/dashboard';
import { Enquiries } from './Component/enquiries/enquiries';

export const routes: Routes = [
    {
        path: "Sidebar",
        component: Sidebar
    },
    {
        path: "Dashboard",
        component: Dashboard
    },
    {
        path: "Customer",
        component: Enquiries
    }
];
