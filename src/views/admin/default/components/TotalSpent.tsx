// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import { lineChartDataTotalSpent, lineChartOptionsTotalSpent } from 'variables/charts';

export default function TotalSpent(props: { [x: string]: any }) {
	// const { ...rest } = props;
	const {data, day, height, outlookFlag} = props;
	const title = ['네트워크', '저장매체', '프린터'];
	const outLookTitle = ['네트워크', '저장매체', 'Outlook', '프린터'];

	let newData:any = [];
	if(outlookFlag === true) {
		for(let i=0; i < data.length-1; i++) {
			newData.push(data[i]);
			newData[i].name = outLookTitle[i];
		}
	} else {
		for(let i=0; i < data.length-1; i++) {
			newData.push(data[i]);
			newData[i].name = title[i];
		}
	}

	const monthArray = data[data.length-1];
	

	// Chakra Color Mode

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

	const [ mounted, setMounted ] = useState(false);
	let dayStr;

	switch(day) {
		case 'day':
			dayStr = '금일'
		break;
		case 'month':
			dayStr = '금월'
		break;
		default :
			dayStr = '금주'
		break;
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			setMounted(true);
		}, 3000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<Card justifyContent='center' alignItems='center' justifyItems='center' flexDirection='column' w='100%' h={height} mb='0px' borderRadius={'0px'} p={'0px'} >
			<Flex height={'40px'} maxH={'40px'} minH={'40px'} alignSelf={'start'} width={'100%'} mt={'10px'} mb='8px' pl={'10px'} pr={'10px'}
			>
				<Text w='100%' justifySelf={'center'} lineHeight={'40px'} color={'#03619E'} fontSize={'18px'} fontWeight={900}
				>
						{dayStr} 정보유출 건수
				</Text>
			</Flex>
			<Flex h={'100%'} w={'100%'}>				
				<Card w={'15%'} px={'15px'}>
					<Flex alignItems={'center'} mb={'5px'}>
						<Box h='8px' w='8px' bg='#3498db' borderRadius='50%' me='4px' alignSelf={'center'} />
						<Text fontSize='12px' color='secondaryGray.600' fontWeight='700' h={'100%'} alignSelf={'center'}>
							네트워크
						</Text>
					</Flex>
					<Flex alignContent={'center'} mb={'5px'}>
						<Box h='8px' w='8px' bg='#e74c3c' borderRadius='50%' me='4px' alignSelf={'center'} />
						<Text fontSize='12px' color='secondaryGray.600' fontWeight='700'>
							저장매체
						</Text>
					</Flex>
					{
						outlookFlag === true ? 
						<Flex alignContent={'center'} mb={'5px'}>
							<Box h='8px' w='8px' bg='#2ecc71' borderRadius='50%' me='4px' alignSelf={'center'} />
							<Text fontSize='12px' color='secondaryGray.600' fontWeight='700'>
								Outlook
							</Text>
					    </Flex> :
						<></>
					}
					<Flex alignContent={'center'} mb={'5px'}>
						<Box h='8px' w='8px' bg= {outlookFlag === true ? '#9b59b6' : '#2ecc71'} borderRadius='50%' me='4px' alignSelf={'center'} />
						<Text fontSize='12px' color='secondaryGray.600' fontWeight='700'>
							프린터
						</Text>
					</Flex>
				</Card>
				<Flex flex={1} direction={'column'}>
					<LineChart chartData={newData} chartOptions={lineChartOptionsTotalSpent(monthArray)} />
				</Flex>
			</Flex>
		</Card>
	);
}
