// Chakra imports
import { Box, Flex, Select, Text, useColorModeValue } from '@chakra-ui/react'
import { ApexOptions } from 'apexcharts'
import Card from 'components/card/Card'
// Custom components
import BarChart from 'components/charts/BarChart'
import RadialChart from 'components/charts/RadialBarChart'
import {
  radialBarChartData,
  radialBarChartOptions
} from 'variables/charts'

export default function UserActivity (props: { [x: string]: any }) {
  const { ...rest } = props

  const Chname = rest.data?.name ? rest.data?.name.charAt(0).toUpperCase() + rest.data?.name.slice(1) : '';
  const newData = [{
    name: Chname || 'Default Name',
    data: rest.data?.data || []
  }];
  let titleName = '';

  rest.data?.name === 'media' ? titleName = '이동식 저장매체 유출 건수'
    : (rest.data?.name === 'outlook' ? titleName = 'Outlook 메일 발송 건수'
      : (rest.data?.name === 'print' ? titleName = '프린터 인쇄 건수' : titleName = '사외 네트워크 유출 건수'));

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white')

  return (
    <Card w='100%' borderRadius={'0px'} {...rest}>
      <Flex align='center' w='100%' px='5px' py='0px'>
        <Text
          me='auto'
          color={textColor}
          fontSize='xl'
          fontWeight='700'
          lineHeight='100%'
        >
          {titleName} TOP 5
        </Text>
      </Flex>
      <Box
        //h='150px'
        mt='auto'
      >
        {radialBarChartData ? (
          <Card p='0' height='150px'>
            <RadialChart
              chartData={radialBarChartData}
              chartOptions={radialBarChartOptions(rest.data?.category)}
            />
          </Card>
        ) : (
          <Text mt='50px' px='30px'
            color={textColor} fontSize='17px' textAlign='start' fontWeight='700' lineHeight='100%'
          >해당 데이터가 존재하지 않습니다!</Text>
        )}
      </Box>

    </Card>
  )
}
