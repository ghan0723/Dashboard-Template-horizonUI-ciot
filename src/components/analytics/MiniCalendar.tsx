'use client';
import { ChangeEvent, useState } from 'react';
import { Text, Icon, Heading, Input, InputGroup, Flex, Badge, FormLabel, Button } from '@chakra-ui/react';
import 'react-calendar/dist/Calendar.css';
// Chakra imports
// Custom components
import Card from 'components/card/Card';
import Swal from 'sweetalert2';

export default function MiniCalendar(props: { startDate: any, setStartDate: any, endDate: any, setEndDate: any, formatDateToDateTimeLocal: any, dateSelect: any, setDateSelect: any, title: any, setTitle: any, realDay:any }) {
  const { startDate, setStartDate, endDate, setEndDate, formatDateToDateTimeLocal, dateSelect, setDateSelect, title, setTitle, realDay } = props

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentDate = new Date(event.target.value);
    let fixDate = modifyDate(currentDate, dateSelect);
    //형식 변경 이후 값 저장
    const formatDate = formatDateToDateTimeLocal(fixDate);
    if (formatDate <= realDay) {
      setEndDate(formatDate);
      setStartDate(event.target.value);
    } else {
      Swal.fire({
        title: '날짜 선택 오류',
        html: `<div style="font-size: 14px;">종료 일자는 오늘까지 가능합니다. <br />날짜를 다시 선택해 주세요.</div>`,
        confirmButtonText: '닫기',
        confirmButtonColor: '#7A4C07',
        focusConfirm: false,
        customClass: {
          popup: 'custom-popup-class',
          title: 'custom-title-class',
          loader: 'custom-content-class',
          confirmButton: 'custom-confirm-button-class'
        },
      })
    }
  };

  const modifyDate = (currentDate: Date, dateSelect: string): Date => {
    let fixDate = new Date(currentDate);

    if (dateSelect.includes('d')) {
      fixDate.setDate(fixDate.getDate() + parseInt(dateSelect.at(0)) - 1);
    } else if (dateSelect.includes('m')) {
      if (fixDate.getDate() - 1 === 0 && dateSelect.at(0) == '1') {
        // 현재 달의 다음 달 첫 날을 구함
        let nextMonthFirstDay;
        // 12월
        if (currentDate.getMonth() === 11) {
          nextMonthFirstDay = new Date(currentDate.getFullYear() + 1, 0, 1);
        } else {
          nextMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }

        // 다음 달 첫 날에서 하루를 빼면 현재 달의 마지막 날이 됨
        nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);

        fixDate = nextMonthFirstDay;
      } else {
        fixDate.setDate(fixDate.getDate() + (30 * parseInt(dateSelect.at(0))));
      }
    } else if (dateSelect.includes('y')) {
      fixDate.setFullYear(fixDate.getFullYear() + 1);
    }
    return fixDate;
  }

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const handleBtn = (str: string) => {
    setDateSelect(str);
    setTitle(str);
    let cnt = 0;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    let changeDate = new Date(currentDate);

    if (str.includes('d')) {
      cnt = +str.at(0);
      changeDate.setDate(currentDate.getDate() - cnt + 1);
    } else if (str.includes('m')) {
      cnt = +str.at(0);

      // if(cnt === 1 && currentDate.getMonth() === 2) {
      //   // 현재 달의 다음 달 첫 날을 구함
      //   const nextMonthFirstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      //   // 다음 달 첫 날에서 하루를 빼면 현재 달의 마지막 날이 됨
      //   nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);

      //   if(currentDate.getDate() === nextMonthFirstDay.getDate()) {
      //     changeDate.setDate(currentDate.getDate() - (nextMonthFirstDay.getDate() * cnt));
      //   } else {
      //     changeDate.setDate(currentDate.getDate() - (31 * cnt));
      //   }
      // } else {
      changeDate.setDate(currentDate.getDate() - (30 * cnt));
      // }
    } else {
      cnt = +str.at(0);
      changeDate.setFullYear(currentDate.getFullYear() - 1); // 연도를 1년 빼줌
    }

    // 날짜 객체를 포맷팅
    const formattedChangeDate = formatDateToDateTimeLocal(changeDate);
    const formattedCurrentDate = formatDateToDateTimeLocal(currentDate);

    // 포맷팅된 문자열을 상태로 설정
    setStartDate(formattedChangeDate);
    setEndDate(formattedCurrentDate);
  }

  return (
    <Card
      justifyContent={'start'}
      justifyItems={'center'}
      w="100%"
      maxW="100vw"
      borderRadius={'0px'}
      h="min-content"
      mb={'0px'}
      p={'3'}
    >
      <Flex justifyContent={'space-between'}>
        <Flex justifyContent={'space-evenly'}>
          <Button
            borderRadius={'0px'}
            bgColor={title === '7d' ? '#E1E7EF' : 'transparent'}
            onClick={() => handleBtn('7d')}
          >
            1주일
          </Button>
          <Button
            borderRadius={'0px'}
            bgColor={title === '1m' ? '#E1E7EF' : 'transparent'}
            onClick={() => handleBtn('1m')}>
            1개월
          </Button>
          <Button
            borderRadius={'0px'}
            bgColor={title === '3m' ? '#E1E7EF' : 'transparent'}
            onClick={() => handleBtn('3m')}>
            3개월
          </Button>
          <Button
            borderRadius={'0px'}
            bgColor={title === '6m' ? '#E1E7EF' : 'transparent'}
            onClick={() => handleBtn('6m')}>
            6개월
          </Button>
          <Button
            borderRadius={'0px'}
            bgColor={title === '1y' ? '#E1E7EF' : 'transparent'}
            onClick={() => handleBtn('1y')}>
            1년
          </Button>
        </Flex>
        <Flex
          w={'25%'}
          display={dateSelect ? "flex" : "none"}
        >
          <FormLabel
            height={'100%'}
            ms="4px"
            display={"flex"}
            alignItems={'center'}
            fontWeight={'700'}
          >
            시작 일자 :
          </FormLabel>
          <Input w={'50%'} type="date" value={startDate} onChange={handleStartDateChange} />
        </Flex>
        <Flex
          w={'25%'}
          display={dateSelect ? "flex" : "none"}>
          <FormLabel
            height={'100%'}
            ms="4px"
            display={"flex"}
            alignItems={'center'}
            fontWeight={'700'}
          >
            종료 일자 : </FormLabel>
          <Input w={'50%'} type="date" value={endDate} onChange={handleEndDateChange} readOnly />
        </Flex>
      </Flex>
    </Card>
  );

}
