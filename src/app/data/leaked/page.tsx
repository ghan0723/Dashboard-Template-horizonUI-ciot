"use client"
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SortingState } from '@tanstack/react-table';
import { getNameCookie } from 'utils/cookie';
import { backIP, frontIP } from 'utils/ipDomain';
import { fetchLogic } from 'utils/fetchData';
import AgentsTable from 'views/admin/dataTables/components/AgentsTable';
import Swal from 'sweetalert2';

export default function DataTables() {
  const [intervalTime, setIntervalTime] = useState<any>(0);
  const [data, setData] = useState<[]>([]);
  const [rows, setRows] = React.useState(20);
  const [page, setPage] = React.useState(0);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [search, setSearch] = React.useState('');                        // search Category
  const search = useRef('');                                                // search Category
  const [searchResult, setSearchResult] = React.useState('');               // 검색어
  const [searchComfirm, setSearchComfirm] = React.useState<boolean>(false); // search 돋보기 버튼
  const [userNameCookie, setUserNameCookie] = useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const chkIntervalId:any = useRef();

  useEffect(() => {
    fetchIntervalTime();
    fetchLog();
  }, []);

  useEffect(() => {
    fetchData();
  }, [userNameCookie]);

  useEffect(() => {
    if (intervalTime !== undefined && intervalTime !== null && intervalTime !== 0 && userNameCookie !== undefined && userNameCookie !== null) {
      const timer: number = +intervalTime[0]?.svr_ui_refresh_interval * 1000;
      fetchData();
      const intervalId = setInterval(() => {
        fetchData();
      }, timer);

      chkIntervalId.current = intervalId;
      
      

      return () => {
        clearInterval(intervalId);
      }
    }

  }, [intervalTime, page, rows, sorting, searchComfirm]);

  const fetchLog = async () => {
    const cookieValue = await getNameCookie();
    
    setUserNameCookie(cookieValue);
    fetchLogic(`log/leaked?username=${cookieValue}`);
  }

  const fetchIntervalTime = async () => {
    try {
      await fetchLogic("setting/intervalTime", setIntervalTime);
    } catch (error) {
    }
  }

  const fetchData = async () => {    
    try {
      const query = 'page=' + page + '&pageSize=' + rows +
        '&sorting=' + (sorting[0]?.id ?? '') + '&desc=' + (sorting[0]?.desc ?? '') +
        '&category=' + search.current + '&search=' + searchResult + '&username=' + userNameCookie;
        

      const response = await fetch(`${backIP}/api/leaked?` + query);
      const data = await response.json();
      
      if(data[1] === 3){        
        clearInterval(chkIntervalId.current);

        Swal.fire({
          title: '관리대상목록 페이지 오류',
          html: '<div style="font-size: 14px;">당신은 모니터 계정이라 접속이 불가능합니다.</div>',
          confirmButtonText: '닫기',
          confirmButtonColor: 'orange',
          customClass: {
            popup: 'custom-popup-class',
            title: 'custom-title-class',
            confirmButton: 'custom-confirm-button-class',
            htmlContainer: 'custom-content-class',
            container: 'custom-content-class'
          },
        }).then(result => {
          if (result.isConfirmed || (result.isDismissed === true && result.dismiss === Swal.DismissReason.backdrop)) {
            window.location.href = `${frontIP}/dashboard/default`;
          }
        });
      } else {
        setData(data[0]);
        router.push(`${pathname}?${query}`);
      }

    } catch (error) {
    }
  };

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
          <Flex
            align="center"
            me="20px"
            cursor='pointer'
          >
            <Box
              fontWeight={'700'}
              padding={'10px 20px'}
              borderRadius={'10px 10px 0px 0px'}
              backgroundColor={'white'}
              color={'#3DA2EE'}
              borderBottom={'2px solid #3DA2EE'}
            >
              관리대상 Agent 목록
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <AgentsTable
        tableData={data}
        setTableData={setData}
        rows={rows} setRows={setRows}
        page={page} setPage={setPage}
        sorting={sorting} setSorting={setSorting}
        search={search}
        searchResult={searchResult} setSearchResult={setSearchResult}
        searchComfirm={searchComfirm} setSearchComfirm={setSearchComfirm}
      />
    </Box>
  );
}
