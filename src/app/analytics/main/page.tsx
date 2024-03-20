'use client';

import {
  Box, Button, Flex,
} from '@chakra-ui/react';
// Assets
import { useEffect, useState } from 'react';
import MiniCalendar from 'components/analytics/MiniCalendar';
import { backIP } from 'utils/ipDomain';
import Keywords from 'components/analytics/keywords';
import ScoringTable from 'components/analytics/ScoringTable';
import ShowDetail from 'components/analytics/ShowDetail';
import { KeywordState } from 'utils/interface';
import { getNameCookie } from 'utils/cookie';
import { fetchLogic } from 'utils/fetchData';


export default function Default() {
  // Chakra Color Mode
  // 한국 시간대의 현재 날짜 및 시간 가져오기
  let today = new Date();
  let realDay = new Date();
  realDay.setDate(today.getDate() - 1);
  let stDate = new Date();
  stDate.setDate(today.getDate() - 7);

  const [keywordFlag, setKeywordFlag] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(formatDateToDateTimeLocal(stDate));
  const [endDate, setEndDate] = useState<string>(formatDateToDateTimeLocal(realDay));
  const [keywordList, setKeywordList] = useState([]);
  const [checkedKeywords, setCheckedKeywords] = useState<KeywordState>({});
  const [data, setData] = useState([]);
  const [detailData, setDetailData] = useState<any>();
  const [dateSelect, setDateSelect] = useState('');
  const [currentPcname, setCurrentPcname] = useState('');
  const [detail, setDetail] = useState<boolean>(false);
  const [title, setTitle] = useState('7d');
  const [userNameCookie, setUserNameCookie] = useState<string>();

  useEffect(() => {
    fetch(`${backIP}/analysis/keywordList`)
    .then(response => {
       return response.json();
    }).then((result:any) => {
      if(result.length !== 0) {
        let checkedValues:any;
        const uniqueKeywords = [...new Set(result)];
        setKeywordList(uniqueKeywords);
        checkedValues = uniqueKeywords.reduce(
          (accumulator: KeywordState, keyword: any) => {
            accumulator[keyword] = {
              check: true,
              level: 10,
            };
            return accumulator;
          },
          {},
        );
        setCheckedKeywords(checkedValues);
      }
      setKeywordFlag(true);
      fetchLog();
    })
  }, []);
  

  useEffect(() => {
    submitData();
  }, [startDate,endDate,checkedKeywords,keywordFlag]);

  const fetchLog = async () => {
    const cookieValue = await getNameCookie();
    setUserNameCookie(cookieValue);
    await fetchLogic(`log/analysis?username=${cookieValue}`);
  }

  const submitData = async () => {
    const cookieValue = await getNameCookie();
    const response = await fetch(`${backIP}/analysis/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        keywords: checkedKeywords,
        username : cookieValue
      })
    })
    if (response.ok) {
      const result = await response.json();
      
      setData(result);
      if(keywordFlag){        
        detailSubmit(result[0]?.pcGuid, result[0]?.pcName, result[0]?.level, result[0]?.status);
        setDetail(true);
        setKeywordFlag(false);
      }
    }
  }

  const detailSubmit = async (pcGuid: string, pcName: string, level: any, status: any) => {
    setCurrentPcname(pcName);
    const cookieValue = await getNameCookie();
    const response = await fetch(`${backIP}/analysis/detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate,
        endDate: endDate,
        username: cookieValue,
        pc_guid: pcGuid,
        level,
        status
      })
    });

    if (response.ok) {
      const result = await response.json();
      setDetailData(result);
      // 레벨이 변경되면 detail을 true로 설정
      if (level !== detailData?.level) {
        setDetail(true);
      }
    }
  }

  const made = async () => {
    const response = await fetch(`${backIP}/analysis/insert`);
  }

  // 날짜 객체를 YYYY-MM-DDTHH:mm 형식의 문자열로 변환하는 함수
  function formatDateToDateTimeLocal(date: Date) {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더함
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  return (
    <Box pt={{ base: '0px', md: '0px' }}>
      <MiniCalendar startDate={startDate} setStartDate={setStartDate}
        endDate={endDate} setEndDate={setEndDate} formatDateToDateTimeLocal={formatDateToDateTimeLocal} dateSelect={dateSelect} setDateSelect={setDateSelect}
        title={title} setTitle={setTitle} realDay={formatDateToDateTimeLocal(today)} ></MiniCalendar>
        <Keywords checkedKeywords={checkedKeywords} setCheckedKeywords={setCheckedKeywords} keywordList={keywordList} ></Keywords>
      {/* <Button onClick={made}>만들기</Button> */}
      <Box display={{ base: 'flex', md: 'block', sm: 'block', xl: 'flex' }} mt={'3'} h={'75vh'}>
        <ScoringTable tableData={data} setDetail={setDetail} detailSubmit={detailSubmit} title={title}
          startDate={startDate} endDate={endDate} checkedKeywords={checkedKeywords} userNameCookie={userNameCookie}
          ></ScoringTable>
        {
          detail === true ?
            <ShowDetail detailData={detailData} currentPcname={currentPcname}></ShowDetail>
            : <></>
        }
      </Box>
    </Box>
  );
}
