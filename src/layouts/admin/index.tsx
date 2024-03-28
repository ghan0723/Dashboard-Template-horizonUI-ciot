// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react'
import Footer from 'components/footer/FooterAdmin'
// Layout components
import Navbar from 'components/navbar/NavbarAdmin'
import Sidebar from 'components/sidebar/Sidebar'
import { SidebarContext } from 'contexts/SidebarContext'
import { PropsWithChildren, useEffect, useState } from 'react'
import routes from 'routes'
import {
  getActiveNavbar,
  getActiveNavbarText,
  getActiveRoute,
  isWindowAvailable
} from 'utils/navigation'

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any
}

// Custom Chakra theme
export default function AdminLayout(props: DashboardLayoutProps) {
  const { children, ...rest } = props
  // states and functions
  // functions for changing the states from components
  useEffect(() => {
    window.document.documentElement.dir = 'ltr'
  })

  return (
    <Box>
      <Box
        minHeight='100vh'
        height='100%'
        overflow='auto'
        position='relative'
        maxHeight='100%'
        w={'100%'}
        maxWidth={'100%'}
        transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
        transitionDuration='.2s, .2s, .35s'
        transitionProperty='top, bottom, width'
        transitionTimingFunction='linear, linear, ease'
      >
        {children}
      </Box>
    </Box>
  )
}
