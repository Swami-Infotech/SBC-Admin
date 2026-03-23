import { Routes } from '@angular/router';
import { Sidebar } from './Component/sidebar/sidebar';
import { Dashboard } from './Component/dashboard/dashboard';
import { Enquiries } from './Component/enquiries/enquiries';
import { Usermanagement } from './Component/usermanagement/usermanagement';
import { Slider } from './Component/slider/slider';
import { Team } from './Component/team/team';
import { Userdetails } from './Component/userdetails/userdetails';
import { RideManagement } from './Component/ride-management/ride-management';
import { Eventmanagement } from './Component/eventmanagement/eventmanagement';
import { Eventdetails } from './Component/eventdetails/eventdetails';
import { Gallery } from './Component/gallery/gallery';
import { Aboutus } from './Component/aboutus/aboutus';
import { AddAbout } from './Component/add-about/add-about';

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
        path: "User Management",
        component: Usermanagement
    },
    {
        path: "Team",
        component: Team
    },
    {
        path: "Slider",
        component: Slider
    },
    {
        path: "UserManagement",
        children: [
            {
                path: "",
                component: Usermanagement
            },
            {
                path: "Userdetails",
                component: Userdetails
            }
        ]
    },
    {
        path: "RideManagement",
        component: RideManagement
    },
    {
        path: "eventmanagement",
        children: [
            {
                path: '',
                component: Eventmanagement
            },
            {
                path: "eventdetails",
                component: Eventdetails
            }
        ]
    },
    {
        path: "gallery",
        component: Gallery
    },
    {
        path: "AboutUs",
        children: [
            {
                path: "",
                component: Aboutus
            },
            {
                path:"AddAbout",
                component:AddAbout
            }
        ]
    }
];
