// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import Card from 'components/card/Card'
// Custom components
import BarChart from 'components/charts/BarChart'
import React from 'react'
import {
  FileSizeChartOptions,
  barChartDataConsumption,
} from 'variables/charts'

export default function FileSize(props: { fileSizeData:any }) {
  const { fileSizeData } = props;
  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white')
  const transformFileSizeData = Object.keys(fileSizeData || {}).map(key => ({
    name: key,
    date: fileSizeData[key].date,
    orgFileSize:fileSizeData[key].org_file_size,
    compFileSize:fileSizeData[key].comp_file_size
  }));

  return (
    <Card w='100%' borderRadius={'0px'} p={'0px'}>
			<Flex height={'30px'} maxH={'30px'} minH={'30px'} alignSelf={'start'} width={'100%'} mt={'10px'} mb='8px' pl={'10px'} pr={'10px'}
			>
				<Text w='100%' justifySelf={'center'} lineHeight={'30px'} color={'#03619E'} fontSize={'18px'} fontWeight={900}>
						[유출 용량(MB)]
				</Text>
			</Flex>
      <Box>
          <Card p='0' height='150px'>
            {
              transformFileSizeData[0]?.date !== undefined ?
              <BarChart
              chartData={[{name:"압축 파일 용량", data:transformFileSizeData[0]?.compFileSize},{name:'일반 파일 용량', data:transformFileSizeData[0]?.orgFileSize}]}
              chartOptions={FileSizeChartOptions(transformFileSizeData[0]?.date)}
              /> :
              <></>
            }
          </Card>
      </Box>
    </Card>
  )
}
