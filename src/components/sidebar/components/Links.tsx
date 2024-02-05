/* eslint-disable */

// chakra imports
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { IRoute } from 'types/navigation';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface SidebarLinksProps {
  routes: IRoute[];
  grade: any;
}
interface ExpandedAccordions {
  [key: number]: boolean;
}
export function SidebarLinks(props: SidebarLinksProps) {
  const { routes, grade } = props;

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

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, index: number) => {
      if (route.secondary) {
          // !(route.layout === 'log' && grade[0]?.grade !== 1)
        return (
          <Accordion allowMultiple key={index}>
            <AccordionItem >
              <AccordionButton
                paddingInlineStart='10px'>
                {route.icon ? (
                  <Box>
                    <HStack
                      spacing={activeRoute(route.secondaryLinks[index]?.path.toLowerCase()) ? '22px' : '26px'}
                    >
                      <Flex w="100%" alignItems="center" justifyContent="center">
                        <Box
                          color={
                            activeRoute(route.secondaryLinks[index]?.path.toLowerCase())
                              ? activeIcon
                              : textColor
                          }
                          _hover={{
                            color:'white',
                            fontWeight:'bold'
                          }}
                          me="18px"
                        >
                          {route.icon}
                        </Box>
                        <Text
                          me="auto"
                          color={
                            activeRoute(route.secondaryLinks[index]?.path.toLowerCase())
                              ? activeColor
                              : textColor
                          }
                          fontWeight={
                            activeRoute(route.secondaryLinks[index]?.path.toLowerCase())
                              ? 'bold'
                              : 'normal'
                          }                      
                          _hover={{
                            color:'white',
                            fontWeight:'bold'
                          }}
                        >
                          {route.name}
                        </Text>
                      </Flex>
                      <Box
                        h="36px"
                        w="4px"
                        bg={
                          activeRoute(route.secondaryLinks[index]?.path.toLowerCase())
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
                        activeRoute(route.secondaryLinks[index]?.path.toLowerCase()) ? '22px' : '26px'
                      }
                      py="5px"
                      ps="10px"
                    >
                      <Text
                        me="auto"
                        color={
                          activeRoute(route.secondaryLinks[index]?.path.toLowerCase())
                            ? activeColor
                            : inactiveColor
                        }
                        fontWeight={
                          activeRoute(route.secondaryLinks[index]?.path.toLowerCase()) ? 'bold' : 'normal'
                        }                      
                        _hover={{
                          color:'white',
                          fontWeight:'bold'
                        }}
                      >
                        {route.name}
                      </Text>
                      <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                    </HStack>
                  </Box>
                )}
              </AccordionButton>
              <AccordionPanel>
                {(route.secondaryLinks && grade[0]?.grade !== 3) ?
                  (
                    <Box pl="4">
                      {route.secondaryLinks.map((secondaryLink, secondaryIndex) => (
                        <Link key={secondaryIndex} href={route.layout + secondaryLink.path}>
                          {/* Render your secondary link as needed */}
                          <Box>
                            <HStack
                              spacing={
                                activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                  ? '22px'
                                  : '26px'
                              }
                              py="5px"
                              ps="10px"
                            >
                              <Text
                                me="auto"
                                color={
                                  activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                    ? activeColor
                                    : inactiveColor
                                }
                                fontWeight={
                                  activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                    ? 'bold'
                                    : 'normal'
                                }
                                _hover={{
                                  color:'white',
                                  fontWeight:'bold'
                                }}
                              >
                                {secondaryLink.name}
                              </Text>
                              <Box
                                h="36px"
                                w="4px"
                                bg={
                                  activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                    ? brandColor
                                    : 'transparent'
                                }
                                borderRadius="5px"
                              />
                            </HStack>
                          </Box>
                        </Link>
                      ))}
                    </Box>
                  ) : (
                    <Box pl="4">
                      {route.secondaryLinks.map((secondaryLink, secondaryIndex) => (
                        secondaryLink.name !== '사용자 관리' &&
                        < Link key={secondaryIndex} href={route.layout + secondaryLink.path} >
                          {/* Render your secondary link as needed */}
                          <Box>
                            <HStack
                              spacing={
                                activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                  ? '22px'
                                  : '26px'
                              }
                              py="5px"
                              ps="10px"
                            >
                              <Text
                                me="auto"
                                color={
                                  activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                    ? activeColor
                                    : inactiveColor
                                }
                                fontWeight={
                                  activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                    ? 'bold'
                                    : 'normal'
                                }
                              >
                                {secondaryLink.name}
                              </Text>
                              <Box
                                h="36px"
                                w="4px"
                                bg={
                                  activeRoute(route.secondaryLinks[secondaryIndex]?.path.toLowerCase())
                                    ? brandColor
                                    : 'transparent'
                                }
                                borderRadius="5px"
                              />
                            </HStack>
                          </Box>
                        </Link>

                      ))}
                    </Box>
                  )}
              </AccordionPanel>
            </AccordionItem >
          </Accordion >
        );
      } else if (route.layout === '/dashboard' || route.layout === '/data' || (grade[0]?.grade !== 3 && route.layout === '/users') ||
        route.layout === '/profile' || route.layout === '/setting') {
        return (
          <Link key={index} href={route.layout + route.path}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={activeRoute(route.path.toLowerCase()) ? '22px' : '26px'}
                  py="5px"
                  ps="10px"
                >
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me="18px"
                      _hover={{
                        color:'white',
                        fontWeight:'bold'
                      }}
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
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
                        color:'white',
                        fontWeight:'bold'
                      }}
                    >
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
                >
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
                    }
                  >
                    {route.name}
                  </Text>
                  <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                </HStack>
              </Box>
            )}
          </Link>
        );
      }
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
