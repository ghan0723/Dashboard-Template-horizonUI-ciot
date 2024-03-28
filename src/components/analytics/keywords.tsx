'use client';
import { useState } from 'react';
import {
  Text,
  Flex,
  Box,
  Checkbox,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import 'react-calendar/dist/Calendar.css';
// Chakra imports
// Custom components
import Card from 'components/card/Card';

export default function Keywords(props: {
  checkedKeywords: any;
  setCheckedKeywords: any;
  keywordList:any[];
}) {
  const { checkedKeywords, setCheckedKeywords, keywordList } = props;

  const [allCheckBtn, setAllCheckBtn] = useState(true); // true : 전체 체크, false : 하나라도 unCheck
  const dangerValues = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

  // 체크 상태 변경 핸들러
  const handleCheckboxChange = (keyword: any) => {
    const changeKeywords: any = { ...checkedKeywords };
    changeKeywords[keyword].check = !changeKeywords[keyword]?.check;

    setCheckedKeywords(changeKeywords);

    // 모든 키워드가 체크되었는지 확인, 전체 선택/해제 버튼 상태 업데이트
    setAllCheckBtn(true);
    for (const key of Object.keys(checkedKeywords)) {
      if (checkedKeywords[key]?.check === false) {
        setAllCheckBtn(false);
        break;
      }
    }
  };

  // 전체 선택, 전체 해제
  const handleBtn = () => {
    setAllCheckBtn(!allCheckBtn);

    const changeKeywords = { ...checkedKeywords };

    // 전체 unCheck
    if (allCheckBtn === true) {
      Object.keys(changeKeywords).forEach((keyword) => {
        changeKeywords[keyword].check = false;
      });
    }
    // 전체 Check
    else {
      Object.keys(changeKeywords).forEach((keyword) => {
        changeKeywords[keyword].check = true;
      });
    }

    setCheckedKeywords(changeKeywords);
  };

  // 위험도 레벨 변경
  const handleLevel = (
    e: React.ChangeEvent<HTMLSelectElement>,
    keyword: any,
  ) => {
    const changeKeywords: any = { ...checkedKeywords };
    changeKeywords[keyword].level = +e.target.value;

    setCheckedKeywords(changeKeywords);
  };

  return (
    <Card w={'100%'} h={'min-content'} borderRadius={'0px'} mb={'0px'} pb={'5px'}>
      <Flex justifyContent={'center'}>
        <Text fontSize={'md'} fontWeight={'700'} w={'250px'}>
          키워드 OR 패턴 설정
        </Text>
        {/* <Button
          value={allCheckBtn === true ? '전체 해제' : '전체 선택'}
          onClick={handleBtn}
          w={'100px'}
          h={'25px'}
          p={0}
          fontSize={'sm'}
          borderRadius={'0px'}
        >
          {allCheckBtn === true ? '전체 해제' : '전체 선택'}
        </Button> */}
        {/* <Box w={'10%'} fontSize={'sm'}>
          <Text ml={'5%'}>
            키워드/건수
          </Text>
          <Text ml={'5%'}>
            위험도
          </Text>
        </Box> */}
        <Flex flexWrap={'wrap'} overflowY={'scroll'} w={'100%'} h={'50px'}>
          {keywordList !== undefined ? (
            keywordList.map((data, i) => {
              return (
                <Flex key={i} h={'min-content'} w={{ base: '50%', sm: '50%',md : '33%',  lg: '25%', '2xl' : '25%' }} alignItems={'start'}>
                  <Text fontSize={'sm'} h={'min-content'} lineHeight={'35px'}>
                    {data}
                  </Text>
                  <Checkbox
                    value={data}
                    defaultChecked={true}
                    h={'35px'}
                    // pt={'3px'}
                    pl={'10px'}
                    pr={'10px'}
                    isChecked={checkedKeywords[data]?.check}
                    onChange={() => handleCheckboxChange(data)}
                  ></Checkbox>
                  <Tooltip label="위험도">
                    <Select
                      id={data}
                      pt={'0px'}
                      w={'75px'}
                      h={'35px'}
                      mr={'5px'}
                      mb={'5px'}
                      defaultValue={checkedKeywords[data]?.level}
                      onChange={(e) => handleLevel(e, data)}
                    >
                      {dangerValues.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Select>
                  </Tooltip>
                </Flex>
              );
            })
          ) : (
            <Text>데이터가 없습니다.</Text>
          )}
        </Flex>
      </Flex>
      <Box bgColor={'#FAFAFA'} w={'100%'} pt={'5px'} pb={'0px'} mb={'0px'}>
        <Text color="black" fontSize={'12px'}>
          ☞ 체크박스 : (마크설정)패턴(건수)으로 분석, (마크해제)키워드(포함여부)로 분석
        </Text>
        <Text color="black" fontSize={'12px'}>
          ☞ 위 험 도 : 1(낮음) ~ 10(높음) (0은 분석할 패턴/키워드 제외)
        </Text>
      </Box>
    </Card>
  );
}
