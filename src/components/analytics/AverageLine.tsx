// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { lineChartOptionsAverage } from 'variables/charts';

export default function AverageLine(props: { detailData: any, currentPcname:any }) {
	const { detailData, currentPcname } = props;

	const transformedDetailData = Object.keys(detailData || {}).map(key => ({
		name: key,
		data: detailData[key].data
	}));

	return (
		<Card w='100%' borderRadius={'0px'} p={'0px'}>
			<Flex height={'30px'} maxH={'30px'} minH={'30px'} alignSelf={'start'} width={'100%'} mt={'10px'} mb='8px' pl={'10px'} pr={'10px'}
			>
				<Text w='100%' justifySelf={'center'} lineHeight={'30px'} color={'#03619E'} fontSize={'18px'} fontWeight={900}>
					[유출 빈도(건)]
				</Text>
			</Flex>
			<Box>
				<Card p='0' height='150px'>
					{
						transformedDetailData[0]?.data !== undefined ?
							<LineChart
								chartData={[{name:`${currentPcname}`, data:transformedDetailData[0]?.data}, transformedDetailData[1]]}
								chartOptions={lineChartOptionsAverage(
									detailData?.평균.date,
								)}
							></LineChart> :
							<></>
					}
				</Card>
			</Box>
		</Card>
	);
}
