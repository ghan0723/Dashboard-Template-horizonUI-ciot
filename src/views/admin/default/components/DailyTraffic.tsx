// Chakra imports
import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import BarChart from 'components/charts/BarChart';

// Custom components
import Card from 'components/card/Card';
import { barChartDataDailyTraffic, barChartOptionsDailyTraffic } from 'variables/charts';
import { useEffect, useState } from 'react';

interface ResultItem {
	name: string;
	data: number[];
  }

export default function DailyTraffic(props: {
	[x: string]: any;
	data: any[];
}) {
	const { ...rest } = props;
	const [keywordData, setKeywordData] = useState([]);
	
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	let dayStr;
	const pcnameArray: any = [];
	// data 배열을 순회하면서 pcname을 배열에 추가
	rest.data?.forEach((item) => {
		const pcname = item.pc_name;
		// 중복을 방지하기 위해 pcname이 배열에 없는 경우에만 추가
		if (!pcnameArray.includes(pcname)) {
			pcnameArray.push(pcname);
		}
	});
	const uniqueDataName = Array.from(new Set(rest.data
		?.flatMap(item => Array.from(new Set(Object.keys(item.keywordCounts))))
	));

	const allKeywords = new Set<string>();
	rest.data?.forEach(item => {
	  Object.keys(item.keywordCounts).forEach(keyword => {
		allKeywords.add(keyword);
	  });
	});
	
	const result: ResultItem[] = Array.from(allKeywords).map(keyword => {
	  const data = rest.data?.map(item => item.keywordCounts[keyword] || 0);
	  return { name: keyword, data };
	});
	
	switch (rest.day) {
		case 'day':
			dayStr = '금일'
			break;
		case 'month':
			dayStr = '금월'
			break;
		default:
			dayStr = '금주'
			break;
	}
	

	return (
		<Card alignItems='center' flexDirection='column' w='100%' h={'100%'} maxH={'100%'} minH={'100%'}
			borderRadius={'0px'} p={'0px'} {...rest}>
			<Flex height={'40px'} maxH={'40px'} minH={'40px'} alignSelf={'start'} width={'100%'} mt={'10px'} mb='8px' pl={'10px'} pr={'10px'}
			>
				<Text w='100%' justifySelf={'center'} lineHeight={'40px'} color={'#03619E'} fontSize={'18px'} fontWeight={900}
				>
					{dayStr} 중요 패턴/키워드 정보유출 주요 내역
				</Text>
			</Flex>
			<Box
				width='100%' h='250px'
				mt='auto'
			>
				<BarChart
					h='150px'
					chartData={result} chartOptions={barChartOptionsDailyTraffic(pcnameArray)} />
			</Box>
		</Card>
	);
}
