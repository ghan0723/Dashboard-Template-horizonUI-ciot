import React from 'react'

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
  Button,
  DrawerHeader
} from '@chakra-ui/react'
import Content from 'components/sidebar/components/Content'
import {
  renderThumb,
  renderTrack,
  renderView
} from 'components/scrollbar/Scrollbar'
import { Scrollbars } from 'react-custom-scrollbars-2'

// Assets
import { IoMenuOutline } from 'react-icons/io5'
import { IRoute } from 'types/navigation'
import { isWindowAvailable } from 'utils/navigation'
import { usePathname } from 'next/navigation'
import { frontIP } from 'utils/ipDomain'

interface SidebarResponsiveProps {
  routes: IRoute[]
}

interface SidebarProps extends SidebarResponsiveProps {
  [x: string]: any
}

function Sidebar(props: SidebarProps) {
  const { routes } = props

  let variantChange = '0.2s linear'
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset'
  )
  // Chakra Color Mode
  let sidebarBg = useColorModeValue('white', 'navy.800')
  let sidebarMargins = '0px'

  // SIDEBAR
  return (
    <Box display={{ sm: 'none', xl: 'block' }} position='fixed' minH='100%'>
      <Box
        // bg={'messenger.800'}
        bg={'#272263'}
        transition={variantChange}
        w='210px'
        h='100vh'
        m={sidebarMargins}
        minH='100%'
        overflowX='hidden'
        boxShadow={shadow}
        float='right'
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  )
}

// FUNCTIONS

export function SidebarResponsive(props: SidebarResponsiveProps) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800')
  let menuColor = useColorModeValue('gray.400', 'white')

  const { isOpen, onOpen, onClose } = useDisclosure();
  // // SIDEBAR
  const btnRef = React.useRef()

  const onCloseDrawer = () => {
    const drawerElement = document.getElementsByClassName('css-17pwl6t')[0] as HTMLElement;
    const drawerModalElement = document.getElementsByClassName('css-14rxmsw')[0] as HTMLElement;

    // 'css-17pwl6t' 클래스를 가진 요소의 스타일 변경
    if (drawerElement) {
      drawerElement.style.display = 'none';
      drawerModalElement.style.width = '0px';
      drawerModalElement.style.height = '0px';
      // 예시: display 속성을 변경하여 요소를 숨깁니다.
    }

    // 'css-14rxmsw' 클래스를 가진 요소의 스타일 변경
    if (drawerModalElement) {
      drawerModalElement.style.opacity = '0';
      drawerModalElement.style.width = '0px';
      drawerModalElement.style.height = '0px';
      // 예시: opacity 속성을 변경하여 투명도를 조절합니다.
    }

    onClose();
  }

  const onOpenDrawer = () => {
    const drawerElement = document.getElementsByClassName('css-17pwl6t')[0] as HTMLElement;
    const drawerModalElement = document.getElementsByClassName('css-14rxmsw')[0] as HTMLElement;

    // 'css-17pwl6t' 클래스를 가진 요소의 스타일 변경
    if (drawerElement) {
      drawerElement.style.display = 'flex';
      drawerModalElement.style.width = '100vw';
      drawerModalElement.style.height = '100vh';
      // 예시: display 속성을 변경하여 요소를 숨깁니다.
    }

    // 'css-14rxmsw' 클래스를 가진 요소의 스타일 변경
    if (drawerModalElement) {
      drawerModalElement.style.opacity = '1';
      drawerModalElement.style.width = '100vw';
      drawerModalElement.style.height = '100vh';
      // 예시: opacity 속성을 변경하여 투명도를 조절합니다.
    }

    onOpen();
  }


  const { routes } = props
  //  BRAND

  return (
    <div className='h2'
      id='ssbs'
    >
      <Flex
        display={{ sm: 'flex', xl: 'none' }}
        alignItems='center'
        justifyContent='flex-end'
      >
        <Flex
          w={'max-content'}
          h={'max-content'}
          onClick={onOpenDrawer}
          mr='30px'
          mt='20px'
        >
          <Icon
            as={IoMenuOutline}
            color={menuColor}
            my='auto'
            w='30px'
            h='30px'
            me='20px'
            _hover={{ cursor: 'pointer' }}
          />
        </Flex>
        <Drawer
          isOpen={isOpen}
          closeOnOverlayClick
          closeOnEsc
          onClose={onCloseDrawer}
          placement='left'
        >
          <DrawerOverlay />
          <DrawerContent
            maxWidth='210px'
            maxHeight='100vh'
            bg={'#272263'}
          >
            <DrawerCloseButton
              zIndex='3'
              onClick={onCloseDrawer}
              color={'white'}
              _focus={{ boxShadow: 'none' }}
              _hover={{ boxShadow: 'none' }}
            />
            <DrawerBody
              bg={'#272263'}
              w='210px'
              h='100vh'
              px='0rem'
              pb='0'
            >
              <Scrollbars
                autoHide
                renderTrackVertical={renderTrack}
                renderThumbVertical={renderThumb}
                renderView={renderView}
              >
                <Content routes={routes} />
              </Scrollbars>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </div>
  )
}
// PROPS

export default Sidebar
