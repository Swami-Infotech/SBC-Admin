import { Routes } from '@angular/router';
import { Sidebar } from './Component/sidebar/sidebar';
import { Dashboard } from './Component/dashboard/dashboard';
import { Enquiries } from './Component/enquiries/enquiries';
import { Usermanagement } from './Component/usermanagement/usermanagement';
import { Slider } from './Component/slider/slider';
import { Team } from './Component/team/team';
import { Userdetails } from './Component/userdetails/userdetails';

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
    },
    {
        path:"Team",
        component:Team
    },
    {
        path:"Slider",
        component:Slider
    },
       {
        path:"UserManagement",
        children:[
            {
                path:"",
                component:Usermanagement
            },
            {
                path:"Userdetails",
                component:Userdetails
            }
        ]
    }
];
