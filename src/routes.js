import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Users = React.lazy(() => import("./views/management/users/UsersList"));
const Roles = React.lazy(() => import("./views/management/roles/RolesList"));
const Permissions = React.lazy(() => import("./views/management/permissions/PermissionsList"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },

  // Management Routes
  { path: "/management/users", name: "Users", element: Users },
  { path: "/management/roles", name: "Roles", element: Roles },
  { path: "/management/permissions", name: "Permissions", element: Permissions },
];

export default routes;
