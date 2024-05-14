'use client';

import React, { useEffect } from 'react';
// Chakra imports
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
// Assets
import { MdOutlineRemoveRedEye, MdPlaylistAddCheckCircle } from 'react-icons/md';
import { backIP, frontIP } from 'utils/ipDomain';
import { useRouter } from 'next/navigation';
import { getNameCookie } from 'utils/cookie';
import Swal from 'sweetalert2';

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');

  const [serverPort, setServerPort] = React.useState();
  const [ret, setRet] = React.useState();
  const [auto, setAuto] = React.useState();
  const [interval, setInterval] = React.useState();
  const [keywordList, setKeywordList] = React.useState("");
  const [userNameCookie, setUserNameCookie] = React.useState<string>();
  const router = useRouter();

  // Alert 관련
  const [isOpenAlert, setIsOpenAlert] = React.useState(false);
  const onCloseAlert = () => setIsOpenAlert(false);
  const cancelRef = React.useRef();

  React.useEffect(() => {
    fetchSettings();
  }, [])

  const fetchSettings = async () => {
    try {
      const cookieValue = await getNameCookie();
      setUserNameCookie(cookieValue);
      const response = await fetch(`${backIP}/setting/servers?username=${cookieValue}`);
      const result = await response.json();
      setServerPort(result.serverPort);
      setRet(result.ret);
      setAuto(result.auto);
      setInterval(result.interval);
      setKeywordList(result.svr_patterns_list);
      if(result.privilege === 3){
        Swal.fire({
          title: '설정 페이지 오류',
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
          if (result.isConfirmed || !isOpenAlert) {
            window.location.href = `${frontIP}/dashboard/default`;
          }
        });
      }
    } catch (error) {
      
    }
  }

  const handleServerPort = (e: any) => {
    const portValue = e.target.value;
    setServerPort(portValue);
  }

  const handleRet = (e: any) => {
    const retValue = e.target.value;
    setRet(retValue);
  }

  const handleauto = (e: any) => {
    const isChecked = e.target.checked;
    setAuto(isChecked);
  }

  const handleInterval = (e: any) => {
    const intervalValue = e.target.value;
    setInterval(intervalValue);
  }

  const handleKeywordListChange = (e: any) => {
    setKeywordList(e.target.value);
  };

  const alertOn = () => {
    setIsOpenAlert(true);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onCloseAlert();
    const response = await fetch(`${backIP}/setting/servers?username=${userNameCookie}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverPort: serverPort,
        ret: ret,
        auto: auto,
        interval: interval,
        keywordList: keywordList,
      })
    })

    if (response.ok) {
      window.location.reload();
    } else {
      const result: any = await response.json();
      alert("에러 확인 : " + result.error);
    }
  }

  return (
    <Card height="100%">
      <Flex
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="80vh"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={'50px'}
      >
        <Flex
          direction="column"
          w="70%"
          maxW="100%"
          background="transparent"
          borderRadius="15px"
        >
          <Flex justifyContent="end" w={'100%'} mb={'3'}>
            <Button
              type='button'
              fontSize="12px"
              bgColor={"white"}
              color={'black'}
              border={'1px solid #ccc'}
              w="80px"
              h="25px"
              p={'3'}
              ml={'-5'}
              borderRadius={'md'}
              onClick={alertOn}
            >
              설정
            </Button>
            {isOpenAlert === true ? (
              <AlertDialog
                isOpen={isOpenAlert}
                onClose={onCloseAlert}
                leastDestructiveRef={cancelRef}
              >
                <AlertDialogOverlay display={'flex'} justifyContent={'center'} alignItems={'center'} />
                <AlertDialogContent
                  width='500px'
                  height='150px'
                  borderRadius='15px'
                  margin={'15%'}
                >
                  <AlertDialogBody>
                    <Flex alignContent={'center'} pt={'15px'}>
                      <MdPlaylistAddCheckCircle fontSize={'50px'} color='#FFA500'></MdPlaylistAddCheckCircle >
                      <Text fontSize={'md'} fontWeight={'500'} alignSelf={'center'} pl={'5px'}>서버 설정을 변경하시겠습니까?</Text>
                    </Flex>
                  </AlertDialogBody>
                  <AlertDialogFooter justifyContent={'center'}>
                    <Button bgColor='#FFA500' color={'white'} onClick={handleSubmit} ml={3} w={'80px'} h={'30px'}>
                      OK
                    </Button>
                    <Button ref={cancelRef} onClick={onCloseAlert} w={'80px'} h={'30px'}>
                      Cancel
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <></>
            )}
            <Button
              type='button'
              fontSize="12px"
              bgColor={"white"}
              color={'black'}
              border={'1px solid #ccc'}
              w="80px"
              h="25px"
              p={'3'}
              ml={'2'}
              borderRadius={'md'}
              onClick={() => router.back()}
            >
              취소
            </Button>
          </Flex>
          <Box w={'100%'} m={'0 auto'} border={'1px solid #ccc'}>
            <form>
              <FormControl p={'10'}>
                <Flex alignContent="center" justifyContent="start" mb="40px">
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    mb='0px'
                  >
                    <Text w="175px" alignSelf='center' fontSize="md" fontWeight='600'>
                      서버 Port
                    </Text>

                  </FormLabel>
                  <Flex w={'100%'}>
                    <Input
                      id="serverIp"
                      name="serverIp"
                      fontSize="sm"
                      type="text"
                      placeholder="서버 Port"
                      fontWeight="500"
                      size="sm"
                      width={{ lg: '80%', base: '50%' }}
                      onChange={handleServerPort}
                      value={serverPort}
                    />
                    <Text
                      ml='10px'
                      alignSelf='center'
                      fontWeight="500"
                      size="sm"
                      w={'70px'}
                    >Port</Text>
                  </Flex>
                </Flex>
                <Flex alignContent="center" justifyContent='flex-start' mb="40px">
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    mb='0px'
                  // ml={'26px'}
                  >
                    <Text w="175px" alignSelf='center' fontSize="md" fontWeight='600'>
                      다운로드 파일 보관기간
                    </Text>

                  </FormLabel>
                  <Flex w={'100%'}>
                    <Input
                      id="serverIp"
                      name="serverIp"
                      fontSize="sm"
                      type="text"
                      placeholder="일"
                      fontWeight="500"
                      size="sm"
                      width={{ lg: '80%', base: '50%' }}
                      onChange={handleRet}
                      value={ret}
                    />
                    <Text
                      ml='10px'
                      alignSelf='center'
                      fontWeight="500"
                      size="sm"
                      w={'70px'}
                    >일 보관</Text>
                  </Flex>
                </Flex>
                <Flex alignContent="center" justifyContent='flex-start' mb="40px">
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    mb='0px'
                  >
                    <Checkbox mr='10px'
                      onChange={handleauto}
                      isChecked={auto}></Checkbox>
                    <Text w="100%" alignSelf='center' fontSize="md" fontWeight='600'>
                      탐지파일 서버로 자동 다운로드
                    </Text>
                  </FormLabel>
                </Flex>
                <Flex alignContent="center" justifyContent='flex-start'>
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    mb='0px'
                  // ml={'26px'}
                  >
                    <Text w="175px" alignSelf='center' fontSize="md" fontWeight='600'>
                      서버 업데이트 주기
                    </Text>
                  </FormLabel>
                  <Flex w={'100%'}>
                    <Input
                      id="serverIp"
                      name="serverIp"
                      fontSize="sm"
                      type="text"
                      placeholder="초"
                      fontWeight="500"
                      size="sm"
                      width={{ lg: '80%', base: '50%' }}
                      onChange={handleInterval}
                      value={interval}
                    />
                    <Text
                      ml='10px'
                      alignSelf='center'
                      fontWeight="500"
                      size="sm"
                      w={'70px'}
                    >초</Text>
                  </Flex>
                </Flex>
                <Flex alignContent="center" justifyContent="start"  mt={'40px'}>
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    alignSelf="start"
                    mb="0px"
                  >
                    <Text w="125px" alignSelf="center" fontSize="md" fontWeight='600'>
                      검색 패턴/키워드
                    </Text>
                  </FormLabel>
                  <Box w={'100%'}>
                    <Textarea
                      name="keywordList"
                      id="keywordList"
                      w="100%"
                      h="125px"
                      resize="none"
                      fontSize={'sm'}
                      placeholder="검색 패턴/키워드"
                      _hover={{ borderColor: 'inherit' }}
                      _focus={{ boxShadow: 'none' }}
                      onChange={handleKeywordListChange}
                      value={keywordList}
                    ></Textarea>
                    <Box bgColor={'#FAFAFA'} w={'100%'} mb="20px" pt={'5px'} pb={'5px'}>
                      <Text color='black' fontSize={'12px'} >
                        ☞ 입력형식 : 키워드=패턴(라인단위 키워드 혹은 정규표현식), 입력 예) 비번=비밀번호, 문자열=([a-zA-Z]*($|[^A-Za-z0-9]))
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </FormControl>
            </form>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}