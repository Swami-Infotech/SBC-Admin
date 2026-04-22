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
import { Login } from './Component/login/login';
import { AddUser } from './Component/usermanagement/add-user/add-user';
import { UserRide } from './Component/ride-management/user-ride/user-ride';
import { AuthGuard } from './Common/auth.guard';
import { Ridesefty } from './Component/ridesefty/ridesefty';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "Login",
        pathMatch: "full"
    },
    {
        path: "Login",
        component: Login
    },
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
        path: "UserManagement",
        children: [
            {
                path: "",
                component: Usermanagement
            },
            {
                path: "Adduser",
                component: AddUser
            },
            {
                path: "Userdetails/:id",
                component: Userdetails
            }
        ]

    },
    {
        path: "Team",
        component: Team
    },
    {
        path: "Slider",
        component: Slider,
        canActivate:[AuthGuard]
    },
    {
        path: "RideManagement",
        children:[
            {
                path:"",
                component: RideManagement,
                canActivate:[AuthGuard]
            },
            {
                path:"UserRide/:id",
                component:UserRide
            }
        ]
       
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
        component: Gallery,
        canActivate:[AuthGuard]
    },
    {
        path: "AboutUs",
        children: [
            {
                path: "",
                component: Aboutus
            },
            {
                path: "AddAbout",
                component: AddAbout
            }
        ]
    },
    {
        path:"RideSefty",
        component:Ridesefty,
        canActivate:[AuthGuard]
    }
];
