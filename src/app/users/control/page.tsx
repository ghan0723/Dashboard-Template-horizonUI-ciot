'use client';
import { Box, Button, Grid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getNameCookie } from 'utils/cookie';
import { fetchLogic } from 'utils/fetchData';
import { backIP, frontIP } from 'utils/ipDomain';
import CheckTable from 'views/admin/profile/components/CheckTable';

export default function ProfileOverview() {
  const [data, setData] = useState<[]>([]);
  //User List Data
  const [loading, setLoading] = React.useState(true);
  //검색 카테고리(ex : 사용자명, 등급)
  const [category, setCategory] = React.useState('username');
  //검색 단어
  const [searchWord, setSearchWord] = React.useState('');
  //버튼을 동작 시키기 위한 State
  const [searchButton, setSearchButton] = React.useState<boolean>();
  const [rows, setRows] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [userNameCookie, setUserNameCookie] = useState<string>();

  React.useEffect(() => {
    fetchUserListLog();
  }, [])

  React.useEffect(() => {
    if (userNameCookie !== undefined) {
      fetchPrivilegeAndData(); // 함수 호출
    }
  }, [searchButton, userNameCookie]);

  const fetchUserListLog = async () => {
    const cookieValue = await getNameCookie();
    setUserNameCookie(cookieValue);
    fetchLogic(`log/userList?username=${cookieValue}`);
  }

  // 먼저 등급을 가져오는 비동기 작업 수행
  const fetchPrivilegeAndData = async () => {
    try {
      const response = await fetch(`${backIP}/user/all?username=` + userNameCookie +
        "&category=" + category + "&searchWord=" + searchWord);
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      Swal.fire({
        title: '사용자 관리 페이지 오류',
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
      }).then((result) => {
          window.location.href = `${frontIP}/dashboard/default`;
      });
      setLoading(false); // 에러가 발생하더라도 setLoading(false) 호출
    }
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <CheckTable
        tableData={data} setTableData={setData} name={'사용자 계정 관리'}
        category={category} setCategory={setCategory}
        searchWord={searchWord} setSearchWord={setSearchWord}
        searchButton={searchButton} setSearchButton={setSearchButton}
        rows={rows} setRows={setRows} page={page} setPage={setPage}
        fetchPrivilegeAndData={fetchPrivilegeAndData}
      />
    </Box>
  );
}
