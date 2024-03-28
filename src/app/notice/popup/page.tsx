'use client';
/* eslint-disable */
import React from 'react';
// Chakra imports
import {
    Box, Button, Heading, Text,

} from '@chakra-ui/react';
import { backIP } from 'utils/ipDomain';
// Custom components
// Assets

export default function SignIn() {
    // Chakra color mode
    const [notice, setNotice] = React.useState('');

    React.useEffect(() => {
        fetchNotice();
    }, [])

    const fetchNotice = async () => {
        const response = await fetch(`${backIP}/notice/popup`);
        const result = await response.json();
        setNotice(result[0].description);
    }

    return (
        <Box mt={'5'} minW="100%" w="100%" bg={'white'} h={'70vh'} maxH={'100vh'} >
            <Text textAlign={'center'} fontSize={'xl'} position={'relative'} p={'8'} minH={'30vh'}>{notice}</Text>
            <Button px={'3'} fontSize={'sm'} position={'fixed'} right={'2vw'} bgColor={'secondaryGray.300'} borderRadius={'md'} bottom={'5vh'} onClick={() => window.close()}>확인</Button>
        </Box>
    );
}
