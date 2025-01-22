import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Users = React.lazy(() => import("./views/management/users/UsersList"));
const Roles = React.lazy(() => import("./views/management/roles/RolesList"));
const Permissions = React.lazy(() =>
  import("./views/management/permissions/PermissionsList")
);

// New Management Pages
const ProductTypes = React.lazy(() =>
  import("./views/management/products/ProductTypesList")
);
const Products = React.lazy(() =>
  import("./views/management/products/ProductList")
);
const AggregationCenters = React.lazy(() =>
  import("./views/management/aggregationCenters/AggregationCentersList")
);
const Farmers = React.lazy(() =>
  import("./views/management/farmers/FarmersList")
);
const GeoLocations = React.lazy(() =>
  import("./views/management/geoLocations/GeoLocationsList")
);
const SmartContracts = React.lazy(() =>
  import("./views/management/smartContracts/SmartContractsList")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },

  // Management Routes
  { path: "/management/users", name: "Users", element: Users },
  { path: "/management/roles", name: "Roles", element: Roles },
  { path: "/management/permissions", name: "Permissions", element: Permissions },

  // New Management Routes
  { path: "/management/product-types", name: "Product Types", element: ProductTypes },
  { path: "/management/products", name: "Products", element: Products },
  { path: "/management/aggregation-centers", name: "Aggregation Centers", element: AggregationCenters },
  { path: "/management/farmers", name: "Farmers", element: Farmers },
  { path: "/management/geo-locations", name: "Geo Locations", element: GeoLocations },
  { path: "/management/smart-contracts", name: "Smart Contracts", element: SmartContracts },
];

export default routes;
