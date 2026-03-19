import { Routes } from '@angular/router';
import { Sidebar } from './Component/sidebar/sidebar';
import { Dashboard } from './Component/dashboard/dashboard';
import { Enquiries } from './Component/enquiries/enquiries';
import { Usermanagement } from './Component/usermanagement/usermanagement';

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
    },
    {
        path:"User Management",
        component:Usermanagement
    }
];
