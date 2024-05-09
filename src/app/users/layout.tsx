'use client';
// Chakra imports
import {
  Portal,
  Box,
  useDisclosure,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin';
// Layout components
import Sidebar, { SidebarResponsive } from 'components/sidebar/Sidebar';
import { SidebarContext } from 'contexts/SidebarContext';
import { PropsWithChildren, useEffect, useState } from 'react';
import routes from 'routes';
import {
  getActiveNavbar,
  getActiveNavbarText,
  getActiveRoute,
} from 'utils/navigation';

interface DashboardLayoutProps extends PropsWithChildren {
  [x: string]: any;
}

// Custom Chakra theme
export default function AdminLayout(props: DashboardLayoutProps) {
  const { children, ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  // functions for changing the states from components
  const { onOpen } = useDisclosure();

  useEffect(() => {
    window.document.documentElement.dir = 'ltr';
  });

  const bg = useColorModeValue('secondaryGray.300', 'navy.900');
  // useEffect(() => {
  //   const deleteCookie = () => {
  //     document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  //   };

  //   window.addEventListener("beforeunload", deleteCookie);

  //   return () => {
  //     window.removeEventListener("beforeunload", deleteCookie);
  //   };
  // }, []); 
  return (
    <Box h="100vh" w="100vw" bg={bg}>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <Sidebar routes={routes} display="none" {...rest} />
        <SidebarResponsive routes={routes} />
        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: 'calc( 100% - 225px )' }}
          maxWidth={{ base: '100%', xl: 'calc( 100% - 225px )' }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
        >
          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            pe="20px"
            minH="100vh"
            pt='0px'
          >
            {children}
          </Box>
          {/* <Box>
            <Footer />
          </Box> */}
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
