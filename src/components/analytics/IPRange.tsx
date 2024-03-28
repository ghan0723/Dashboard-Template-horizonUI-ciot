'use client';
import { ChangeEvent, useState } from 'react';
import {
  Text,
  Icon,
  Heading,
  Input,
  InputGroup,
  Flex,
  Badge,
  FormLabel,
  Textarea,
  Box,
} from '@chakra-ui/react';
import 'react-calendar/dist/Calendar.css';
// Chakra imports
// Custom components
import Card from 'components/card/Card';
import { RiH3 } from 'react-icons/ri';
import IconBox from 'components/icons/IconBox';
import { FaNetworkWired } from 'react-icons/fa';

export default function IPRangeBox(props: { ipRange: any; setIpRange: any }) {
  const { ipRange, setIpRange } = props;

  const handleIpRangeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setIpRange(event.target.value);
  };

  return (
    <Card
      mb={'3'}
    //   justifyContent={'space-between'}
      justifyItems={'center'}
      flexDirection="row"
      // maxW="100vw"
      p="20px 15px"
      h="min-content"
      borderRadius={'0px'}
      maxH={'80%'}
    >
      <Flex ml={'5px'} w={'100%'}>
        <FormLabel ms="4px" mt={'5px'} alignItems={'center'} w={'70px'} fontWeight={'700px'}>
            IP 입력 :
        </FormLabel>
        <Box>
          <Textarea
            w={'100%'}
            value={ipRange}
            onChange={handleIpRangeChange}
            overflowY={'scroll'}
            resize={'none'}
          />
          <Text
            color="black"
            fontSize={'12px'}
            w={'100%'}
            display={{ base: '', md: 'block', sm: 'none' }}
          >
            ☞ 입력형식 : CIDR 혹은 Range(라인단위 IP범위), 입력 예) CIDR형식 :
            192.168.0.0/16, Range형식 : 192.168.10.1-192.168.10.254
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}
