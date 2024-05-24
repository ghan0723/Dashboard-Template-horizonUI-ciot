"use client"
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import CheckTable from 'views/admin/dataTables/components/CheckTable';
import React, { useEffect, useRef, useState } from 'react';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SortingState } from '@tanstack/react-table';
import { getNameCookie } from 'utils/cookie';
import { backIP } from 'utils/ipDomain';
import { fetchLogic } from 'utils/fetchData';
import Swal from 'sweetalert2';

export default function DataTables() {
  const [intervalTime, setIntervalTime] = useState<any>(0);
  const [data, setData] = useState<[]>([]);
  const [rows, setRows] = React.useState(20);
  const [page, setPage] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [search, setSearch] = React.useState('');                           // search Category
  const search = useRef('');                                                // search Category
  const [searchResult, setSearchResult] = React.useState('');               // 검색어
  const [searchComfirm, setSearchComfirm] = React.useState<boolean>(false); // search 돋보기 버튼

  const intervalId = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [url, setUrl] = useState(searchParams.get('contents') !== null ? searchParams.get('contents') : 'network');
  const [outlookFlag, setOutlookFlag] = useState();
  const userNameCookie = useRef<string>();

  useEffect(() => {
    fetchOutlookFlag();
  }, [outlookFlag])

  useEffect(() => {
    // fetchIntervalTime이 다 끝난 후에 fetchLog()를 실행
    const initialize = async () => {
      await fetchIntervalTime();
      await fetchLog();
    };
  
    initialize();
  }, []);

  useEffect(() => {
    if(userNameCookie.current !== undefined) {
      fetchData();
    }
  }, [userNameCookie]);

  useEffect(() => {
    if (!isOpen && userNameCookie.current !== undefined) {
      const timerId = setTimeout(() => {
        fetchData();
      }, 300);

      return () => {
        clearTimeout(timerId);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (intervalTime !== undefined && intervalTime !== null && intervalTime !== 0 && userNameCookie.current !== undefined) {
      const timer: number = +intervalTime[0]?.svr_ui_refresh_interval * 1000;

      fetchData();
      const intervalId = setInterval(() => {
        fetchData();
      }, timer);

      return () => {
        clearInterval(intervalId);
      }
    }

  }, [intervalTime, page, rows, sorting, url, searchComfirm]);

  const fetchLog = async () => {    
    await fetchLogic(`log/tables?username=${userNameCookie.current}`);
  }

  const fetchOutlookFlag = async () => {
    await fetchLogic(`setting/outlook?username=${userNameCookie.current}`, setOutlookFlag);
  }

  const fetchIntervalTime = async () => {
    try {
      const cookieValue = await getNameCookie();
      userNameCookie.current = cookieValue;
      await fetchLogic("setting/intervalTime", setIntervalTime);
    } catch (error) {
    }
  }

  const fetchData = async () => {
    try {
      const query = 'contents=' + url + '&page=' + page + '&pageSize=' + rows +
        '&sorting=' + (sorting[0]?.id ?? '') + '&desc=' + (sorting[0]?.desc ?? '') +
        '&category=' + search.current + '&search=' + searchResult + '&username=' + userNameCookie.current;

      const response = await fetch(`${backIP}/api?` + query);
      const data = await response.json();
      setData(data);
      router.replace(`${pathname}?${query}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUrlAndNoSorting = (url: any) => {
    setSorting([{ desc: true, id: '' }]);
    setUrl(url);
  }

  const fetchScreenshot = async (fileName: any) => {
    try {
      const response = await fetchLogic(`log/screenshot?username=${userNameCookie.current}&fileName=${fileName}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchDownload = async (fileName: any) => {
    try {
      const response = await fetchLogic(`log/download?username=${userNameCookie.current}&fileName=${fileName}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <Box>
      <Flex direction="column">
        <Flex
          mt="45px"
          // mb="20px"
          justifyContent="start"
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'start', md: 'center' }}
        >
          {/* <Text fontSize="2xl" ms="24px" fontWeight="700">
            Data Tables
          </Text> */}
          <Flex
            align="center"
            me="20px"
            cursor='pointer'
          >
            <Box
              onClick={() => handleUrlAndNoSorting('network')}
              fontWeight={url === 'network' ? '700' : '500'}
              padding={'10px 20px'}
              borderRadius={'10px 10px 0px 0px'}
              backgroundColor={url === 'network' ? 'white' : undefined}
              color={url === 'network' ? '#3DA2EE' : '#939CA9'}
              borderBottom={url === 'network' ? '2px solid #3DA2EE' : '2px solid #939CA9'}
              _hover={{
                fontWeight: '700',
                background: 'white',
                borderBottom: '2px solid #3DA2EE',
                color: '#3DA2EE'
              }}
            >
              네트워크 정보유출 내역
            </Box>
            <Box
              onClick={() => handleUrlAndNoSorting('media')}
              fontWeight={url === 'media' ? '700' : '500'}
              padding={'10px 20px'}
              borderRadius={'10px 10px 0px 0px'}
              backgroundColor={url === 'media' ? 'white' : undefined}
              color={url === 'media' ? '#3DA2EE' : '#939CA9'}
              borderBottom={url === 'media' ? '2px solid #3DA2EE' : '2px solid #939CA9'}
              _hover={{
                fontWeight: '700',
                background: 'white',
                borderBottom: '2px solid #3DA2EE',
                color: '#3DA2EE'
              }}
            >
              이동식 저장매체 정보유출 내역
            </Box>
            <Box
              onClick={() => handleUrlAndNoSorting('outlook')}
              fontWeight={url === 'outlook' ? '700' : '500'}
              padding={'10px 20px'}
              borderRadius={'10px 10px 0px 0px'}
              backgroundColor={url === 'outlook' ? 'white' : undefined}
              color={url === 'outlook' ? '#3DA2EE' : '#939CA9'}
              borderBottom={url === 'outlook' ? '2px solid #3DA2EE' : '2px solid #939CA9'}
              display={outlookFlag ? "" : "none"}
              _hover={{
                fontWeight: '700',
                background: 'white',
                borderBottom: '2px solid #3DA2EE',
                color: '#3DA2EE'
              }}
            >
              Outlook 메일발송 내역
            </Box>
            <Box
              onClick={() => handleUrlAndNoSorting('print')}
              fontWeight={url === 'print' ? '700' : '500'}
              padding={'10px 20px'}
              borderRadius={'10px 10px 0px 0px'}
              backgroundColor={url === 'print' ? 'white' : undefined}
              color={url === 'print' ? '#3DA2EE' : '#939CA9'}
              borderBottom={url === 'print' ? '2px solid #3DA2EE' : '2px solid #939CA9'}
              _hover={{
                fontWeight: '700',
                background: 'white',
                borderBottom: '2px solid #3DA2EE',
                color: '#3DA2EE'
              }}
            >
              프린트 인쇄 내역
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <CheckTable
        tableData={data}
        setTableData={setData}
        name={url}
        rows={rows} setRows={setRows}
        page={page} setPage={setPage}
        sorting={sorting} setSorting={setSorting}
        search={search}
        searchResult={searchResult} setSearchResult={setSearchResult}
        searchComfirm={searchComfirm} setSearchComfirm={setSearchComfirm}
        isOpen={isOpen} onOpen={onOpen} onClose={onClose}
        fetchScreenshot={fetchScreenshot} fetchDownload={fetchDownload}
      />
    </Box>
  );
}
