// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Progress,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
// import KeywordsDetail from 'components/analytics/keywordsDetail';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import React from 'react';
// Assets
import KeywordsDetail from './keywordsDetail';
import FileSize from './FileSize';
import AverageLine from './AverageLine';
import { TbLetterCSmall, TbLetterHSmall, TbLetterISmall, TbLetterLSmall, TbLetterMSmall } from 'react-icons/tb';

export default function ShowDetail(props: { detailData: any; currentPcname: any; }) {
  const { detailData, currentPcname } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColorSecondary = 'gray.400';
  const box = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const transformedDetailData = Object.keys(detailData?.result[1] || {}).map(key => ({
    name: key,
    data: detailData?.result[1][key].data
  }));

  return (
    <Card alignItems="center" w={{ base: '48%', md: '100%', sm: '100%', xl: '48%' }} m={{ base: '0 auto', xl: '0 auto', md: '10px auto', sm: '10px auto' }} p={'2'}>
      <Flex w={'100%'} justifyContent={'center'}>
      <Icon w='36px'  h='36px' lineHeight={'36px'} mr={'15px'} 
          bgColor={
            detailData?.result[3].level >= 5 ? (
              '#D32F2F'
            ) : detailData?.result[3].level >= 4 ? (
              '#E57373'
            ) : detailData?.result[3].level >= 3 ? (
              '#FFA000'
            ) : detailData?.result[3].level >= 2 ? (
              'green.400'
            ) : detailData?.result[3].level >= 1 ? (
              'blue.500'
            ) : null
          }
          color={'white'}
          borderRadius={'50%'}
          as={
            detailData?.result[3].level >= 5 ? (
              TbLetterCSmall
            ) : detailData?.result[3].level >= 4 ? (
              TbLetterHSmall
            ) : detailData?.result[3].level >= 3 ? (
              TbLetterMSmall
            ) : detailData?.result[3].level >= 2 ? (
              TbLetterLSmall
            ) : detailData?.result[3].level >= 1 ? (
              TbLetterISmall
            ) : null
          }
        />
        <Text color={textColorPrimary} fontWeight="bold" fontSize="2xl">
          {`기간별 위험점수 집계 현황 : ${currentPcname} `}
        </Text>
      </Flex>
      <Flex w={'100%'} justifyContent={'space-around'}>
        <Text color={textColorPrimary} fontSize="md" mt="10px">
          {`분석 시작 일자 : ${detailData?.result[3].startDate ? detailData?.result[3].startDate.slice(0, 10) : ''}`}
        </Text>
        <Text color={textColorPrimary} fontSize="md" mt="10px" mb={'10px'}>
          {`분석 종료 일자 : ${detailData?.result[3].endDate ? detailData?.result[3].endDate.slice(0, 10) : ''}`}
        </Text>

      </Flex>
      <Box w="100%" h={'30%'}>
        <KeywordsDetail data={detailData?.result[0]}></KeywordsDetail>
      </Box>
      <Box w='100%' h={'30%'} border={'1px solid #ccc'} ><AverageLine detailData={detailData?.result[1]} currentPcname={currentPcname}></AverageLine></Box>
      <Box w='100%' h={'30%'} border={'1px solid #ccc'}>
        <FileSize fileSizeData={detailData?.result[2]} ></FileSize>
      </Box>
    </Card>
  );
}
