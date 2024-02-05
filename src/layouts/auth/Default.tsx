// Chakra imports
import { Box, Flex, Icon, useColorModeValue, Text } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
// Assets
import { ReactNode } from 'react';

function AuthIllustration(props: {
  children: ReactNode;
  illustrationBackground?: string;
}) {
  const authBg = useColorModeValue('white', 'navy.900');
  const { children, illustrationBackground } = props;
  // Chakra color mode
  return (
    <Flex minW="100vh" w="100%" bg={authBg} position="relative" h="max-content">
      <Flex
        h={{
          sm: 'initial',
          md: 'unset',
          lg: '100vh',
          xl: '100vh',
        }}
        // w={{ base: '100vw', md: '100vw' }}
        maxW={{ md: '66%', lg: '1313px' }}
        mx={{ md: 'auto' }}
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="center"
        direction="column"
      >
        {children}
        <Box
          display={{ base: 'none', md: 'none' }}
          h="100%"
          minH="100vh"
          w={{ lg: '50vw', '2xl': '44vw' }}
          position="absolute"
          right="0px"
        >
          {/* <Flex
            style={{ backgroundImage: `url(${illustrationBackground})` }}
            justify="center"
            align="end"
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
          /> */}
        </Box>
        {/* <Footer mb={{ xl: '3vh' }} /> */}
      </Flex>
      {/* <FixedPlugin /> */}
    </Flex>
  );
}

export default AuthIllustration;
