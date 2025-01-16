import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilUser,
  cilSettings,
  cilLockLocked,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
      {
        component: CNavItem,
        name: 'Users',
        to: '/management/users',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Roles',
        to: '/management/roles',
        icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Permissions',
        to: '/management/permissions',
        icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
