import { Routes } from "@angular/router";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { SideBannerLayoutComponent } from "./layout/side-banner-layout/side-banner-layout.component";
import { TopHeaderLayoutComponent } from "./layout/top-header-layout/top-header-layout.component";
import { AuthGuard } from "./services/auth.guard";
// import { TaskListComponent } from "./components/task-list/task-list.component";

export const routes: Routes = [
  {
    path: "login",
    component: SideBannerLayoutComponent,
    children: [
      {
        path: "",
        component: LoginComponent,
      },
    ],
  },
  {
    path: "register",
    component: SideBannerLayoutComponent,
    children: [
      {
        path: "",
        component: RegisterComponent,
      },
    ],
  },
  {
    path: "",
    component: TopHeaderLayoutComponent,
    canActivate: [AuthGuard], // this is the component with the <router-outlet> in the template
    children: [
      {
        path: "",
        redirectTo: "tasks",
        pathMatch: "full",
      },
      {
        path: "home",
        component: HomeComponent,
      },
      { path: "about-us", component: AboutUsComponent },
      // { path: "tasks", component: TaskListComponent, canActivate: [AuthGuard] },
      // {
      //   path: "admin",
      //   component: TaskListComponent,
      //   canActivate: [AuthGuard, AdminGuard],
      // },
      {
        path: "tasks",
        loadChildren: () =>
          import("./modules/tasks/tasks.module").then((m) => m.TaskModule),
      }, // Lazy load task module
    ],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
