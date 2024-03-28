/* eslint-disable */

// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Link from 'next/link';
import { IRoute } from 'types/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface SidebarLinksProps {
  routes: IRoute[];
  privilege: any;
}

export function SidebarLinks(props: SidebarLinksProps) {
  const { routes, privilege } = props;

  //   Chakra color mode
  const pathname = usePathname();
  let activeColor = useColorModeValue('white', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600',
  );
  let activeIcon = useColorModeValue('white', 'white');
  let textColor = useColorModeValue('gray.400', 'white');
  let brandColor = useColorModeValue('white', 'brand.400'); // 클릭시 bar
  const [expandedIndex, setExpandedIndex] = useState<number[]>();

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {      
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  useEffect(() => {
    let index = -1;

    if (pathname.includes('/data')) {
      index = 0;
    } else if (pathname.includes('/users')) {
      index = 1;
    } else if (pathname.includes('/setting')) {
      index = 2;
    } else if (pathname.includes('/log')) {
      index = 3;
    }

    setExpandedIndex([index]);
  }, []);

  const handleAccordionChange = (index: number[]) => {
    setExpandedIndex(index);
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: IRoute[]) => {
    return (
      <Accordion allowMultiple={true} index={expandedIndex} onChange={handleAccordionChange}>
        {routes.map((route, index: number) => {
          if (route.secondary) {
            if (privilege === 1 || 
                (privilege === 2 && route.layout !== '/log') || 
                (privilege === 3 && route.layout !== '/log' && route.layout !== '/setting')) {
              return (
                  <AccordionItem key={index}>
                    <AccordionButton
                      paddingInlineStart="10px"                            
                      
                      color={textColor}
                      fontWeight={'normal'}
                      _hover={{
                        color:'#272263',
                        fontWeight:'bold',
                        bgColor: '#9AA4C7'
                      }}
                    >
                      {route.icon ? (
                        <Box >
                          <HStack
                            spacing={'26px'}
                          >
                            <Flex
                              w="100%"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Box me="18px">
                                {route.icon}
                              </Box>
                              <Text me="auto">
                                {route.name}
                              </Text>
                            </Flex>
                            <Box
                              h="36px"
                              w="4px"
                              bg={'transparent'}
                              borderRadius="5px"
                            />
                          </HStack>
                        </Box>
                      ) : (
                        <Box>
                          <HStack
                            spacing={'26px'}
                            py="5px"
                            ps="10px"
                          >
                            <Text
                              me="auto"
                              color={inactiveColor}
                              fontWeight={'normal'}
                            >
                              {route.name}
                            </Text>
                            <Box
                              h="36px"
                              w="4px"
                              bg="brand.400"
                              borderRadius="5px"
                            />
                          </HStack>
                        </Box>
                      )}
                    </AccordionButton>
                    <AccordionPanel pt={'0px'} pr={'0px'} pb={'5px'}>
                      {route.secondaryLinks && privilege === 1 ? (
                        <Box pl="4">
                          {route.secondaryLinks.map(
                            (secondaryLink, secondaryIndex) => (
                              <Link
                                key={secondaryIndex}
                                href={route.layout + secondaryLink.path}
                              >
                                {/* Render your secondary link as needed */}
                                <Box>
                                  <HStack
                                    spacing={
                                      activeRoute(
                                        route.secondaryLinks[
                                          secondaryIndex
                                        ]?.path.toLowerCase(),
                                      )
                                        ? '22px'
                                        : '20px'
                                    }
                                    py="5px"
                                    ps="15px"
                                    color={
                                      activeRoute(
                                        route.secondaryLinks[
                                          secondaryIndex
                                        ]?.path.toLowerCase(),
                                      )
                                        ? activeColor
                                        : inactiveColor
                                    }
                                    fontWeight={
                                      activeRoute(
                                        route.secondaryLinks[
                                          secondaryIndex
                                        ]?.path.toLowerCase(),
                                      )
                                        ? 'bold'
                                        : 'normal'
                                    }
                                    _hover={{
                                      color:'#272263',
                                      fontWeight:'bold',
                                      bgColor: '#9AA4C7'
                                    }}
                                  >
                                    <Text
                                      me="auto"
                                    >
                                      {secondaryLink.name}
                                    </Text>
                                    <Box
                                      h="20px"
                                      w="4px"
                                      bg={
                                        activeRoute(
                                          route.secondaryLinks[
                                            secondaryIndex
                                          ]?.path.toLowerCase(),
                                        )
                                          ? brandColor
                                          : 'transparent'
                                      }
                                      borderRadius="5px"
                                    />
                                  </HStack>
                                </Box>
                              </Link>
                            ),
                          )}
                        </Box>
                      ) : (
                        <Box pl="4">
                          {route.secondaryLinks.map(
                            (secondaryLink, secondaryIndex) =>
                            ((privilege === 2) ||
                            (privilege === 3 && secondaryLink.name !== '사용자 관리' && secondaryLink.name !== '관리대상 목록')) && (
                                <Link
                                  key={secondaryIndex}
                                  href={route.layout + secondaryLink.path}
                                >
                                  {/* Render your secondary link as needed */}
                                  <Box>
                                    <HStack
                                      spacing={
                                        activeRoute(
                                          route.secondaryLinks[
                                            secondaryIndex
                                          ]?.path.toLowerCase(),
                                        )
                                          ? '22px'
                                          : '26px'
                                      }
                                      py="5px"
                                      ps="10px"
                                      color={
                                        activeRoute(
                                          route.secondaryLinks[
                                            secondaryIndex
                                          ]?.path.toLowerCase(),
                                        )
                                          ? activeColor
                                          : inactiveColor
                                      }
                                      fontWeight={
                                        activeRoute(
                                          route.secondaryLinks[
                                            secondaryIndex
                                          ]?.path.toLowerCase(),
                                        )
                                          ? 'bold'
                                          : 'normal'
                                      }
                                      _hover={{
                                        color:'#272263',
                                        fontWeight:'bold',
                                        bgColor: '#9AA4C7'
                                      }}
                                    >
                                      <Text
                                        me="auto"
                                      >
                                        {secondaryLink.name}
                                      </Text>
                                      <Box
                                        h="26px"
                                        w="4px"
                                        bg={
                                          activeRoute(
                                            route.secondaryLinks[
                                              secondaryIndex
                                            ]?.path.toLowerCase(),
                                          )
                                            ? brandColor
                                            : 'transparent'
                                        }
                                        borderRadius="5px"
                                      />
                                    </HStack>
                                  </Box>
                                </Link>
                              ),
                          )}
                        </Box>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
              );
            } else {
              return null;
            }
          } else if (
            route.layout === '/dashboard' ||
            (privilege !== 3 && (route.layout === '/users')) ||
            route.layout === '/profile' ||
            (route.layout === '/analytics')
          ) {
            return (
              <Link key={index} href={route.layout + route.path}>
                {route.icon ? (
                  <Box borderTop={route.layout === '/analytics' ? '1px' : '0px'} borderColor={'inherit'}>
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                      }
                      py="5px"
                      ps="10px"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? 'bold'
                          : 'normal'
                      }
                      _hover={{
                        color: '#272263',
                        fontWeight: 'bold',
                        bgColor: '#9AA4C7'
                      }}
                    >
                      <Flex
                        w="100%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box me="18px">
                          {route.icon}
                        </Box>
                        <Text me="auto">
                          {route.name}
                        </Text>
                      </Flex>
                      <Box
                        h="36px"
                        w="4px"
                        bg={
                          activeRoute(route.path.toLowerCase())
                            ? brandColor
                            : 'transparent'
                        }
                        borderRadius="5px"
                      />
                    </HStack>
                  </Box>
                ) : (
                  <Box>
                    <HStack
                      spacing={
                        activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                      }
                      py="5px"
                      ps="10px"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? 'bold'
                          : 'normal'
                      }
                      _hover={{
                        color: '#272263',
                        fontWeight: 'bold',
                        bgColor: '#9AA4C7'
                      }}
                    >
                      <Text me="auto">
                        {route.name}
                      </Text>
                      <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                    </HStack>
                  </Box>
                )}
              </Link>
            );
          }
        })}
      </Accordion>
    );
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
