import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilSettings,
  cilLockLocked,
  cilBasket,
  cilFactory,
  cilMap,
  cilHandshake,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

// Utility function to check permissions
const hasPermission = (permissions, requiredPermissions) => {
  return requiredPermissions.some((perm) => permissions.includes(perm))
}

// Fetch user permissions from localStorage or any other storage/context
const permissions = JSON.parse(localStorage.getItem('permissions')) || []

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavGroup,
    name: 'Admin Tools',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      ...(hasPermission(permissions, ['READ_USER'])
        ? [
            {
              component: CNavItem,
              name: 'Users',
              to: '/management/users',
              icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
            },
          ]
        : []),
      ...(hasPermission(permissions, ['MANAGE_ROLE'])
        ? [
            {
              component: CNavItem,
              name: 'Roles',
              to: '/management/roles',
              icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
            },
          ]
        : []),
      ...(hasPermission(permissions, ['MANAGE_PERMISSIONS'])
        ? [
            {
              component: CNavItem,
              name: 'Permissions',
              to: '/management/permissions',
              icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
            },
          ]
        : []),
    ],
  },
  {
    component: CNavGroup,
    name: 'Product Management',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    items: [
      ...(hasPermission(permissions, ['MANAGE_PRODUCT_TYPE'])
        ? [
            {
              component: CNavItem,
              name: 'Product Types',
              to: '/management/product-types',
              icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
            },
          ]
        : []),
      ...(hasPermission(permissions, ['MANAGE_PRODUCTS'])
        ? [
            {
              component: CNavItem,
              name: 'Products',
              to: '/management/products',
              icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
            },
          ]
        : []),
    ],
  },
  {
    component: CNavItem,
    name: 'Aggregation Centers',
    to: '/management/aggregation-centers',
    icon: <CIcon icon={cilFactory} customClassName="nav-icon" />,
    ...(hasPermission(permissions, ['MANAGE_AGGREGATION_CENTERS']) ? {} : { disabled: true }),
  },
  {
    component: CNavItem,
    name: 'Farmers',
    to: '/management/farmers',
    icon: <CIcon icon={cilHandshake} customClassName="nav-icon" />,
    ...(hasPermission(permissions, ['MANAGE_FARMERS']) ? {} : { disabled: true }),
  },
  {
    component: CNavItem,
    name: 'Geo Locations',
    to: '/management/geo-locations',
    icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
    ...(hasPermission(permissions, ['MANAGE_LOCATIONS']) ? {} : { disabled: true }),
  },
  {
    component: CNavItem,
    name: 'Smart Contracts',
    to: '/management/smart-contracts',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    ...(hasPermission(permissions, ['MANAGE_SMART_CONTRACTS']) ? {} : { disabled: true }),
  },
]

export default _nav
