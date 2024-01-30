'use client';

import {
  Box,
  Flex,
  FormLabel,
  Image,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Grid,
  GridItem,
  Text,
  Card,
  IconButton,
} from '@chakra-ui/react';
// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdEditDocument,
  MdFileCopy,
  MdMail,
  MdMediation,
  MdPrint,
  MdVideoFile,
  MdVideoLabel,
  MdVideocam,
} from 'react-icons/md';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
// Assets
import { useEffect, useState } from 'react';
import { fetchLogic } from 'utils/fetchData';
import { getNameCookie } from 'utils/cookie';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import UserActivity from 'views/admin/default/components/UserActivity';

type LineChartsData = {
  name: string;
  data: [{}];
};

type networkData = {
  allfiles: number;
  beforefiles: number;
};

type mediaData = {
  allmedias: number;
  beforemedias: number;
};

type outlookData = {
  alloutlooks: number;
  beforeoutlooks: number;
};

type printData = {
  allprints: number;
  beforeprints: number;
};

type barData = {
  name: string;
  data: string[];
  category: string[];
};

export default function Default() {
  // Chakra Color Mode
  const [intervalTime, setIntervalTime] = useState<any>(0);
  const [lineChartsData, setLineChartsData] = useState<LineChartsData[]>([]);
  const [net, setNet] = useState<networkData>();
  const [med, setMed] = useState<mediaData>();
  const [outlook, setOutlook] = useState<outlookData>();
  const [print, setPrint] = useState<printData>();
  const [top, setTop] = useState<barData[]>([]);
  const [select, setSelect] = useState('week'); // 일/주/월
  const [comp, setComp] = useState([]);
  const [keywordData, setKeywordData] = useState();
  const secondBoxHeights = '250px';

  useEffect(() => {
    fetchIntervalTime();
  }, []);

  useEffect(() => {
    if (intervalTime !== undefined && intervalTime !== null && intervalTime !== 0) {
      const timer: number = +intervalTime[0]?.svr_update_interval * 1000;
      
      fetchData();

      const intervalId = setInterval(() => {
        fetchData();
      }, timer);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [intervalTime, select]);

  const fetchIntervalTime = async () => {
    try {
      await fetchLogic('setting/intervalTime', setIntervalTime);
    } catch (error) {
      console.log('데이터 가져오기 실패 : ', error);
    }
  };

  const fetchData = async () => {
    try {
      const userNameCookie = await getNameCookie();
      await fetchLogic("lineCharts?select=" + select + "&username=" + userNameCookie, setLineChartsData);
      await fetchLogic("network/all?select=" + select + "&username=" + userNameCookie, setNet);
      await fetchLogic("media/all?select=" + select + "&username=" + userNameCookie, setMed);
      await fetchLogic("outlook/all?select=" + select + "&username=" + userNameCookie, setOutlook);
      await fetchLogic("print/all?select=" + select + "&username=" + userNameCookie, setPrint);
      await fetchLogic('bar/count?select=' + select + "&username=" + userNameCookie, setTop);
      await fetchLogic("complex/all?select=" + select + "&username=" + userNameCookie, setComp);
      await fetchLogic("keyword/all?select=" + select + "&username=" + userNameCookie, setKeywordData);
    } catch (error) {
      console.log("데이터 가져오기 실패 : ", error);
    }
  };

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  return (
    // <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
    <Box pt={{ base: '0px', md: '0px' }}>
      <Flex marginBottom={'10px'} justifyContent={'space-between'}>
        {/* <Card padding={'10px'} border={'none'}> */}
        <Text
          mr={'20px'}
          p={'5px'}
          fontSize={'2xl'}
          fontWeight={'700'}
          color={'#272263'}
        >
          {select !== 'month' ? (select !== 'week' ? '금일' : '금주') : '금월'}{' '}
          사용자 단말 정보유출 집계 현황
        </Text>
        {/* </Card> */}
        <Select
          fontSize="sm"
          defaultValue="week"
          width="unset"
          fontWeight="700"
          backgroundColor={'white'}
          color={'black'}
          borderRadius={'10px'}
          borderColor={'lightgray'}
          marginRight={'5px'}
          alignSelf="end"
          onChange={(e) => setSelect(e.target.value)}
        >
          <option value="day">일</option>
          <option value="week">주</option>
          <option value="month">월</option>
        </Select>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 2, '2xl': 4 }}
        gap="20px"
        mb='15px'
        h={{ base: '400px', md: '190px', lg: '190px', '2xl': '95px' }}
      >
        <MiniStatistics // Earnings
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={'#9676E0'} />
              }
            />
          }
          name="network"
          value={net?.allfiles + "건"}
          growth={net?.beforefiles}
          day={select}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdVideocam} color={'#3564CF'} />
              }
            />
          }
          name="media"
          value={med?.allmedias + "건"}
          growth={med?.beforemedias}
          day={select}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdMail} color={'#F86160'} />}
            />
          }
          growth={outlook?.beforeoutlooks}
          name="outlook"
          value={outlook?.alloutlooks + "건"}
          day={select} />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPrint} color={'#F79256'} />}
            />
          }
          name="print"
          value={print?.allprints + "건"}
          growth={print?.beforeprints}
          day={select}
        />
      </SimpleGrid>
      <Grid
      // { base: 1, md: 2, lg: 2, '2xl': 4 }
        templateColumns={{base : '1', '2xl' : `repeat(5,1fr)`}}
        templateRows={{base : `repeat(3,'250px')`, '2xl' : `repeat(1,1vw)`}}
        gap="20px"
        w={'100%'}
        h={{base : +secondBoxHeights*3, '2xl' : secondBoxHeights}}
        mb={'20px'}
      >
        <GridItem
          colSpan={{base : 1, '2xl' : 2}}
          rowSpan={1}
        >
          <Box h={secondBoxHeights}>
            <TotalSpent data={lineChartsData} day={select} height={'100%'} />
          </Box>
        </GridItem>
        <GridItem
          colSpan={{base : 1, '2xl' : 2}}
          rowSpan={1}
        >
          <Box h={secondBoxHeights}>
            <DailyTraffic day={select}  data={keywordData} />
          </Box>
        </GridItem>
        <GridItem
          rowSpan={1}
        >
          <Box h={secondBoxHeights}>
            <PieCard day={select} />
          </Box>
        </GridItem>
      </Grid>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2, '2xl': 4 }} gap="20px" mb="20px" h={'210px'}>
        <WeeklyRevenue data={top[0]} day={select} />
        <WeeklyRevenue data={top[1]} day={select} />
        <WeeklyRevenue data={top[2]} day={select} />
        <WeeklyRevenue data={top[3]} day={select} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 2, '2xl': 4 }} gap="20px" mb="20px" h={'250px'}>
        <ComplexTable tableData={comp[0]}></ComplexTable>
        <ComplexTable tableData={comp[1]}></ComplexTable>
        <ComplexTable tableData={comp[2]}></ComplexTable>
        <ComplexTable tableData={comp[3]}></ComplexTable>
      </SimpleGrid>
    </Box>
  );
}
