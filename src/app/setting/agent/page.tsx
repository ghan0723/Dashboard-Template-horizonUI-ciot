'use client';

import React, { useState } from 'react';
// Chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  List,
  ListItem,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import { backIP, frontIP } from 'utils/ipDomain';
import { useRouter } from 'next/navigation';
import { MdPlaylistAddCheckCircle } from 'react-icons/md';
import { getNameCookie } from 'utils/cookie';
import { DeleteIcon, Icon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import { isValidIPAddress } from 'utils/valid';

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');

  const [uid, setUid] = React.useState(0);
  const [serverIP, setServerIP] = React.useState("");
  const [serverPort, setServerPort] = React.useState("");
  const [serverInterval, setServerInterval] = React.useState(0);
  const [licenseDist, setLicenseDist] = React.useState("");
  const [exceptionList, setExceptionList] = React.useState("");
  // const [keywordList, setKeywordList] = React.useState("");
  const [flag, setFlag] = React.useState(0);
  const [process, setProcess] = React.useState([]);
  const [procName, setProcName] = React.useState('');
  const [updateFile, setUpdateFile] = React.useState('');
  const [dbFilePath, setDbFilePath] = React.useState('');
  const [userNameCookie, setUserNameCookie] = useState<string>();
  const router = useRouter();

  // Alert 관련
  const [isOpenAlert, setIsOpenAlert] = React.useState(false);
  const onCloseAlert = () => setIsOpenAlert(false);
  const [isOpenReAlert, setIsOpenReAlert] = React.useState(false);
  const onCloseReAlert = () => setIsOpenReAlert(false);
  const cancelRef = React.useRef();

  React.useEffect(() => {
    fetchSettings();
  }, [])

  React.useEffect(() => {
    fetchProcess();
  }, [])

  React.useEffect(() => {
    fetchUpdateFile();
  }, [])

  const fetchSettings = async () => {
    const cookieValue = await getNameCookie();
    setUserNameCookie(cookieValue);
    try {
      const response = await fetch(`${backIP}/setting/agents?username=${cookieValue}`);
      const result = await response.json();
      setUid(result[0][0]?.uid);
      setServerIP(result[0][0]?.clnt_svr_ip);
      setServerPort(result[0][0]?.clnt_svr_port);
      setServerInterval(result[0][0]?.clnt_svr_conn_interval);
      setLicenseDist(result[0][0]?.clnt_license);
      setExceptionList(result[0][0]?.clnt_exceptions_list);
      // setKeywordList(result[0][0]?.svr_patterns_list);
      setFlag(result[0][0]?.svr_checkbox_flag);
      if(result[2][0].privilege === 3){
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

  const fetchProcess = async () => {
    try {
      const response = await fetch(`${backIP}/setting/process`);
      const result = await response.json();
      setProcess(result);
    } catch (error) {
    }
  }

  const fetchUpdateFile = async () => {
    try {
      const response = await fetch(`${backIP}/setting/updateFile`);
      const result = await response.json();
      setDbFilePath(result[0]?.updateFile);
    } catch (error) {
    }
  }

  const handleServerIPChange = (e: any) => {
    setServerIP(e.target.value);
  };

  const handleServerPortChange = (e: any) => {
    setServerPort(e.target.value);
  };

  const handleServerIntervalChange = (e: any) => {
    setServerInterval(e.target.value);
  };

  const handleLicenseDistChange = (e: any) => {
    setLicenseDist(e.target.value);
  }

  const handleExceptionListChange = (e: any) => {
    setExceptionList(e.target.value);
  };

  // const handleKeywordListChange = (e: any) => {
  //   setKeywordList(e.target.value);
  // };

  const handleProcessListChange = (e: any) => {
    setProcName(e.target.value);
  }

  const handleUpdateFileChange = (e: any) => {
    if (e.target.value === '') {
      setUpdateFile('');
    }
    else if (!e.target.value.includes('.dat')) {
      setUpdateFile('');
      Swal.fire({
        title: '사용자 관리 페이지 오류',
        html: '<div style="font-size: 14px;">.dat 파일만 선택 가능합니다.</div>',
        confirmButtonText: '닫기',
        confirmButtonColor: 'orange',
        customClass: {
          popup: 'custom-popup-class',
          title: 'custom-title-class',
          confirmButton: 'custom-confirm-button-class',
          htmlContainer: 'custom-content-class',
          container: 'custom-content-class'
        },
      });
    } else {
      setUpdateFile(e.target.value);
      const selectFile = e.target.files[0];
      const formData = new FormData();
      formData.append('file', selectFile);

      fetch(`${backIP}/setting/fileUpdate`, {
        method: 'post',
        body: formData
      });
    }
  }

  console.log('updateFile',updateFile);
  

  const addProcessEnterKey = async (e: any) => {
    if (e.key === 'Enter' && procName !== undefined && procName !== null && procName !== '') {
      e.preventDefault();
      const response = await fetch(`${backIP}/setting/process?username=${userNameCookie}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procName: procName
        })
      })
      if (response.ok) {
        const result = await response.json();
        if(result.result === 1) {
          Swal.fire({
            title: '정탐 프로세스 추가',
            html: '<div style="font-size: 14px;">중복된 프로세스가 있습니다.</div>',
            confirmButtonText: '닫기',
            confirmButtonColor: 'orange',
            customClass: {
              popup: 'custom-popup-class',
              title: 'custom-title-class',
              confirmButton: 'custom-confirm-button-class',
              htmlContainer: 'custom-content-class',
              container: 'custom-content-class'
            },
          });
        }
        
        fetchProcess();
      }
    }
  }

  const addProcessButton = async (e: any) => {
    if (procName !== undefined && procName !== null && procName !== '') {
      e.preventDefault();
      const response = await fetch(`${backIP}/setting/process?username=${userNameCookie}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procName: procName
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if(result.result === 1) {
          Swal.fire({
            title: '정탐 프로세스 추가',
            html: '<div style="font-size: 14px;">중복된 프로세스가 있습니다.</div>',
            confirmButtonText: '닫기',
            confirmButtonColor: 'orange',
            customClass: {
              popup: 'custom-popup-class',
              title: 'custom-title-class',
              confirmButton: 'custom-confirm-button-class',
              htmlContainer: 'custom-content-class',
              container: 'custom-content-class'
            },
          });
        }

        fetchProcess();
      }
    }
  }

  const deleteProcessButton = async (e: any, procName: string) => {
    if (procName !== undefined && procName !== null) {
      e.preventDefault();
      const response = await fetch(`${backIP}/setting/delete?username=${userNameCookie}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ procName: procName }),
      })
      if (response.ok) {
        fetchProcess();
      }
    }
  }

  const addUpdateAgentFileButton = async (e: any) => {
    if (updateFile !== undefined && updateFile !== null && updateFile !== '') {
      e.preventDefault();
      const response = await fetch(`${backIP}/setting/updateFile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userNameCookie, // 로그용
          updateFile: updateFile
        })
      })
      if (response.ok) {
        fetchUpdateFile();
      }
    }
  }

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>, flagValue: any) => {
    let converseFlag;

    // check일 때
    if (e.target.checked === true) {
      // flag에 flag가 포함되어 있지 않다면...
      if ((flag & flagValue) !== flagValue) {
        converseFlag = flag + flagValue;
        setFlag(converseFlag);
      }
    }
    // unChecked
    else {
      if ((flag & flagValue) === flagValue) {
        converseFlag = flag - flagValue;
        setFlag(converseFlag);
      }
    }
  };

  const isReadOnly = (flagValue: any) => {
    return (flag & flagValue) !== flagValue;
  };

  const alertCheck = (e: any) => {
    if ((flag & 1) === 1 || (flag & 2) === 2) {
      onCloseAlert();
      setIsOpenReAlert(true);
    } else {
      handleSubmit(e);
    }
  };

  function validateIPRange(ipRange: string): boolean {
    // 빈 문자열인 경우 유효함
    if (ipRange === null || !ipRange.trim()) {
      return true;
    }

    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    const ipRangeRegex = /^(\d{1,3}\.){3}\d{1,3}-(\d{1,3}\.){3}\d{1,3}$/;

    // 사용자 입력을 줄바꿈 또는 쉼표를 기준으로 자릅니다.
    const inputs: string[] = ipRange.trim().split(/[\r\n,]+\s*/);
    // 각 입력에 대해 형식을 검사합니다.

    // 빈 문자열인 경우 유효함
    if (!ipRange.trim()) {
      return true;
    }

    for (const input of inputs) {
        if (ipRangeRegex.test(input)) {
            // IP 대역을 "-"로 분할하여 시작과 끝 IP 주소를 추출합니다.
            const ipAddresses: string[] = input.split("-");
            const startIP: string[] = ipAddresses[0].trim().split(".");
            const endIP: string[] = ipAddresses[1].trim().split(".");
        
            // 시작 IP 주소와 끝 IP 주소가 유효한지 확인합니다.
            if (startIP.length !== 4 || endIP.length !== 4 || !isValidIPAddress(startIP) || !isValidIPAddress(endIP)) {
                return false;
            }
        
            // 시작 IP 주소가 끝 IP 주소보다 작은지 확인합니다.
            for (let i = 0; i < 4; i++) {
                if (parseInt(startIP[i], 10) > parseInt(endIP[i], 10)) {
                    return false;
                }
            }
        } else if (cidrRegex.test(input)){
          const [ip, cidr] = input.split("/");
          const parts = ip.split(".").map(part => parseInt(part, 10));
          const cidrBits = parseInt(cidr, 10);
          const cidrMask = (0xffffffff << (32 - cidrBits)) >>> 0;
          const startIpParts = parts.map((part, index) => part & ((cidrMask >> (24 - 8 * index)) & 0xff));
          const endIpParts = parts.map((part, index) => part | ((~cidrMask >> (24 - 8 * index)) & 0xff));
            if (parts.some(part => isNaN(part) || part < 0 || part > 255)) {
                return false; // IP 주소의 각 자리수가 0에서 255 사이의 값을 가져야 합니다.
            }
            const cidrValue = parseInt(cidr, 10);
            if (isNaN(cidrValue) || cidrValue < 0 || cidrValue > 32 ) {
                return false; // CIDR 접두사는 0에서 32 사이의 값을 가져야 하며, 8의 배수여야 합니다.
            }
        } else {
            return false;
        }
    }
    
    return true;
  }
  
  const handleSubmit = async (e: any) => {
    if(!validateIPRange(exceptionList) && (flag & 16) === 16){
      onCloseAlert();
      Swal.fire({
        title: '에이전트 설정 오류',
        html: `<div style="font-size: 14px;">감시 예외대역의 값이 올바르지 않습니다. <br /> 다시 입력해주세요.</div>`,
        confirmButtonText: '닫기',
        confirmButtonColor: 'orange',
        focusConfirm: false,
        customClass: {
            popup: 'custom-popup-class',
            title: 'custom-title-class',
            htmlContainer: 'custom-content-class',
            container: 'custom-content-class',
            confirmButton: 'custom-confirm-button-class'
        },
      })
      e.preventDefault(); 
    } else {
      const cookieName = await getNameCookie();
      e.preventDefault();
      const response = await fetch(`${backIP}/setting/agent?username=${cookieName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: uid + 1,
          serverIP: serverIP,
          serverPort: serverPort,
          serverInterval: serverInterval,
          licenseDist: licenseDist,
          exceptionList: exceptionList,
          flag: flag,
        })
      })
  
      if (response.ok) {
        window.location.reload();
      } else {
        const result: any = await response.json();
        alert("에러 확인 : " + result.error);
      }
    }
  }

  // 알람 켜기
  const alertOn = () => {
    setIsOpenAlert(true);
  }

  return (
    <Card height="100%">
      <Flex
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        mb={{ base: '30px', md: '40px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '20px' }}
        flexDirection="column"
      >
        <Flex
          direction="column"
          w="95%"
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mb={{ base: '20px', md: 'auto' }}
        >
          <Flex justifyContent="end" w={'100%'} mb={'3'}>
            <Button
              type='button'
              fontSize="12px"
              bgColor={"white"}
              color={'#aaa'}
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
                <AlertDialogOverlay />
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
                      <Text fontSize={'md'} fontWeight={'500'} alignSelf={'center'} pl={'5px'}>에이전트 설정을 변경하시겠습니까?</Text>
                    </Flex>
                  </AlertDialogBody>
                  <AlertDialogFooter justifyContent={'center'}>
                    <Button bgColor='#FFA500' color={'white'} onClick={alertCheck} ml={3} w={'80px'} h={'30px'}>
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
            {isOpenReAlert === true ? (
              <AlertDialog
                isOpen={isOpenReAlert}
                onClose={onCloseReAlert}
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
                      <MdPlaylistAddCheckCircle fontSize={'50px'} color='#EE5D50'></MdPlaylistAddCheckCircle >
                      <Text fontSize={'sm'} w={'90%'} fontWeight={'500'} alignSelf={'center'} pl={'5px'}>
                        서버 IP와 Port 정보의 설정 동기화가 포함되어 있습니다.
                        이 설정이 적용되면 Agent의 서버 접속정보가 변경되므로 매우 주의하여야 합니다.
                        그래도 변경하시겠습니까?
                      </Text>
                    </Flex>
                  </AlertDialogBody>
                  <AlertDialogFooter justifyContent={'center'}>
                    <Button bgColor='#EE5D50' color={'white'} onClick={handleSubmit} ml={3} w={'80px'} h={'30px'}>
                      OK
                    </Button>
                    <Button ref={cancelRef} onClick={onCloseReAlert} w={'80px'} h={'30px'}>
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
          <Accordion border={'0.5px solid #ccc'} mb={'30px'} allowMultiple={true}>
            <AccordionItem id='procName' border={'none'}>
              <AccordionButton>정탐 프로세스 및 에이전트 업데이트 파일 등록</AccordionButton>
              <AccordionPanel>
                <Flex w={'100%'} justifyContent={'space-between'}>
                  <Flex w={'47%'} alignContent="center" justifyContent="end" border={'1px solid #ccc'} p={'3'} >
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
                        정탐 프로세스
                      </Text>
                      <Checkbox
                        id="procName"
                        name="procName"
                        isChecked={(flag & 64) === 64 ? true : false}
                        onChange={(e) => handleCheckBoxChange(e, 64)}
                        visibility={'hidden'}
                      ></Checkbox>
                    </FormLabel>
                    <Box w={'100%'}>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Input
                          id="procName"
                          name="procName"
                          fontSize="sm"
                          type="text"
                          placeholder="정탐 프로세스 작성"
                          fontWeight="500"
                          size="sm"
                          width="100%"
                          mb={'2'}
                          ml={'5px'}
                          _active={{
                            borderStyle: 'solid',
                            borderColor: '#E2E8F0',
                            borderWidth: '1px'
                          }}
                          _focus={{
                            borderStyle: 'solid',
                            borderColor: '#E2E8F0',
                            borderWidth: '1px'
                          }}
                          onChange={handleProcessListChange}
                          onKeyDown={addProcessEnterKey}
                          value={procName}
                        //값 입력후 엔터키 or 버튼 클릭시 추가로 해야지
                        >
                        </Input>
                        <Button w={'64px'} h={'32px'}
                          mb={'2'}
                          bgColor={'blue.500'}
                          color={'white'}
                          fontWeight={'500'}
                          borderRadius={'0px'}
                          _hover={{
                            backgroundColor: 'white',
                            color: 'blue.500',
                            borderStyle: 'solid',
                            borderColor: 'blue.500',
                            borderWidth: '1px'
                          }}
                          onClick={addProcessButton}
                        >추가</Button>
                      </Flex>
                      <Box w={'100%'} mb={'25px'}>
                        <List h={'95px'} overflowY={'scroll'}>
                          {process.map((item, index) => (
                            <ListItem
                              key={index}
                              display="flex"
                              justifyContent={'space-between'}
                              alignItems="center"
                              h={'30px'}
                              _hover={{
                                cursor: 'pointer',
                                backgroundColor: '#f0f0f0'
                              }}
                            >
                              <Text w={'80%'} ml={'10px'}>{item.proc_name}</Text>
                              <IconButton aria-label='Delete Process'
                                icon={<DeleteIcon></DeleteIcon>}
                                size={'30px'}
                                backgroundColor={'transparent'}
                                mr={'15px'}
                                _hover={{
                                  color: 'red'
                                }}
                                onClick={(e) => deleteProcessButton(e, item.proc_name)}
                              ></IconButton>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  </Flex>
                  <Box w={'47%'} border={'1px solid #ccc'} p={'3'}  >
                    <Flex w={'100%'} alignContent="center" justifyContent="start">
                      <FormLabel
                        display="flex"
                        fontSize="sm"
                        fontWeight="600"
                        color={textColor}
                        alignContent="center"
                        mb="0px"
                      >
                        <Text w="180px" fontSize="md" fontWeight='600'>
                          에이전트 업데이트 파일
                        </Text>
                      </FormLabel>
                      <Flex
                        w={'100%'}
                        justifyContent="space-between"
                      >
                        <Input
                          id="updateFile"
                          name="updateFile"
                          fontSize="sm"
                          type="file"
                          placeholder="에이전트 업데이트 파일"
                          fontWeight="500"
                          size="sm"
                          width="100%"
                          mb={'2'}
                          _active={{
                            borderStyle: 'solid',
                            borderColor: '#E2E8F0',
                            borderWidth: '1px'
                          }}
                          _focus={{
                            borderStyle: 'solid',
                            borderColor: '#E2E8F0',
                            borderWidth: '1px'
                          }}
                          value={updateFile}
                          accept='.dat'
                          onChange={handleUpdateFileChange}
                        >
                        </Input>
                        <Button w={'75px'} h={'32px'}
                          mb={'2'}
                          bgColor={'blue.500'}
                          color={'white'}
                          fontWeight={'500'}
                          borderRadius={'0px'}
                          _hover={{
                            backgroundColor: 'white',
                            color: 'blue.500',
                            borderStyle: 'solid',
                            borderColor: 'blue.500',
                            borderWidth: '1px'
                          }}
                          onClick={addUpdateAgentFileButton}
                        >업데이트</Button>
                      </Flex>
                    </Flex>
                    <Box mt={'5%'} id='fileUrl'><b>현재 에이전트 파일 : </b>{dbFilePath}</Box>
                  </Box>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <form method="post" action={`${backIP}/setting/agent`}
          >
            <FormControl border={'1px solid #ccc'} p={'5'}>
              <Flex>
                <Flex w={'50%'} alignContent="center" justifyContent="start" mb="20px">
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    mb="0px"
                  >
                    <Checkbox
                      id="serverIpChk"
                      name="serverIpChk"
                      mr="10px"
                      isChecked={(flag & 1) === 1 ? true : false}
                      onChange={(e) => handleCheckBoxChange(e, 1)}
                    ></Checkbox>
                    <Text w="120px" alignSelf="center" fontSize="md" fontWeight='600'>
                      서버 IP
                    </Text>
                  </FormLabel>
                  <Input
                    id="serverIp"
                    name="serverIp"
                    fontSize="sm"
                    type="text"
                    placeholder="서버 IP"
                    fontWeight="500"
                    size="sm"
                    width="100%"
                    onChange={handleServerIPChange}
                    readOnly={isReadOnly(1)}
                    value={serverIP}
                  />
                </Flex>
                <Flex w={'50%'} alignContent="center" justifyContent="start" mb="20px" ml={'5%'}>
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="center"
                    mb="0px"
                  >
                    <Checkbox
                      id="serverPortChk"
                      name="serverPortChk"
                      mr="10px"
                      isChecked={(flag & 2) === 2 ? true : false}
                      onChange={(e) => handleCheckBoxChange(e, 2)}
                    ></Checkbox>
                    <Text w="120px" alignSelf="center" fontSize="md" fontWeight='600'>
                      서버 Port
                    </Text>
                  </FormLabel>
                  <Input
                    id="serverPort"
                    name="serverPort"
                    fontSize="sm"
                    type="text"
                    placeholder="서버 Port"
                    fontWeight="500"
                    size="sm"
                    width="100%"
                    onChange={handleServerPortChange}
                    readOnly={isReadOnly(2)}
                    value={serverPort}
                  />
                </Flex>
              </Flex>
              <Flex alignContent="center" justifyContent="start" mb="20px">
                <FormLabel
                  display="flex"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  alignContent="center"
                  mb="0px"
                >
                  <Checkbox
                    id="serverIntervalChk"
                    name="serverIntervalChk"
                    mr="10px"
                    isChecked={(flag & 32) === 32 ? true : false}
                    onChange={(e) => handleCheckBoxChange(e, 32)}
                  ></Checkbox>
                  <Text w="120px" alignSelf="center" fontSize="md" fontWeight='600'>
                    서버 접속 주기
                  </Text>
                </FormLabel>
                <Input
                  id="serverInterval"
                  name="serverInterval"
                  fontSize="sm"
                  type="text"
                  placeholder="서버 접속 주기"
                  fontWeight="500"
                  size="sm"
                  width="100%"
                  onChange={handleServerIntervalChange}
                  readOnly={isReadOnly(32)}
                  value={serverInterval}
                />
              </Flex>
              <Flex alignContent="center" justifyContent="start" mb="20px">
                <FormLabel
                  display="flex"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  alignContent="center"
                  mb="0px"
                >
                  <Checkbox
                    id="licenseDistChk"
                    name="licenseDistChk"
                    mr="10px"
                    isChecked={(flag & 8) === 8 ? true : false}
                    onChange={(e) => handleCheckBoxChange(e, 8)}
                  ></Checkbox>
                  <Text w="120px" alignSelf="center" fontSize="md" fontWeight='600'>
                    라이센스 배포
                  </Text>
                </FormLabel>
                <Input
                  id="licenseDist"
                  name="licenseDist"
                  fontSize="sm"
                  type="text"
                  placeholder="라이센스"
                  fontWeight="500"
                  size="sm"
                  width="100%"
                  onChange={handleLicenseDistChange}
                  readOnly={isReadOnly(8)}
                  value={licenseDist}
                />
              </Flex>
              <Flex w={'95%'}>
                <Flex w={'50%'} alignContent="center" justifyContent="start" mb="20px">
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="start"
                    mb="0px"
                  >
                    <Checkbox
                      id="screenShotChk"
                      name="screenShotChk"
                      mr="10px"
                      isChecked={(flag & 128) === 128 ? true : false}
                      onChange={(e) => handleCheckBoxChange(e, 128)}
                    ></Checkbox>
                    <Text alignSelf="center" fontSize="md" fontWeight='600'>
                      탐지 시 스크린샷 자동 생성 및 다운로드
                    </Text>
                  </FormLabel>
                </Flex>
                <Flex w={'50%'} alignContent="center" justifyContent="start" mb="20px" ml={'10%'}>
                  <FormLabel
                    display="flex"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    alignContent="start"
                    mb="0px"
                  >
                    <Checkbox
                      id="outlookChk"
                      name="outlookChk"
                      mr="10px"
                      isChecked={(flag & 256) === 256 ? true : false}
                      onChange={(e) => handleCheckBoxChange(e, 256)}
                    ></Checkbox>
                    <Text alignSelf="center" fontSize="md" fontWeight='600'>
                      (유출탐지 기능) Outlook 보낸편지함 메일 수집
                    </Text>
                  </FormLabel>
                </Flex>
              </Flex>
              <Flex alignContent="center" justifyContent="start" >
                <FormLabel
                  display="flex"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  alignSelf="start"
                  mb="0px"
                >
                  <Checkbox
                    id="exceptionListChk"
                    name="exceptionListChk"
                    mr="10px"
                    isChecked={(flag & 16) === 16 ? true : false}
                    onChange={(e) => handleCheckBoxChange(e, 16)}
                  ></Checkbox>
                  <Text w="120px" alignSelf="center" fontSize="md" fontWeight='600'>
                    감시 예외대역
                  </Text>
                </FormLabel>
                <Box w={'100%'}>
                  <Textarea
                    name="exceptionList"
                    id="exceptionList"
                    w="100%"
                    h="75px"
                    resize="none"
                    fontSize={'sm'}
                    placeholder="감시 예외대역"
                    _hover={{ borderColor: 'inherit' }}
                    _focus={{ boxShadow: 'none' }}
                    onChange={handleExceptionListChange}
                    readOnly={isReadOnly(16)}
                    value={exceptionList}
                  ></Textarea>
                  <Box bgColor={'#FAFAFA'} w={'100%'} mb="20px" pt={'5px'} pb={'5px'}>
                    <Text color='black' fontSize={'12px'}>
                      ☞ 입력형식 : CIDR 혹은 Range(라인단위 IP범위), 입력 예) CIDR형식 : 192.168.0.0/16, Range형식 : 192.168.10.1-192.168.10.254
                    </Text>
                  </Box>
                </Box>
              </Flex>
              {/* <Flex alignContent="center" justifyContent="start" >
                <FormLabel
                  display="flex"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  alignContent="center"
                  alignSelf="start"
                  mb="0px"
                >
                  <Checkbox
                    id="keywordListChk"
                    name="keywordListChk"
                    mr="10px"
                    isChecked={(flag & 64) === 64 ? true : false}
                    onChange={(e) => handleCheckBoxChange(e, 64)}
                  ></Checkbox>
                  <Text w="125px" alignSelf="center" fontSize="md" fontWeight='600'>
                    검색 패턴/키워드
                  </Text>
                </FormLabel>
                <Box w={'100%'}>
                  <Textarea
                    name="keywordList"
                    id="keywordList"
                    w="100%"
                    h="75px"
                    resize="none"
                    fontSize={'sm'}
                    placeholder="검색 패턴/키워드"
                    _hover={{ borderColor: 'inherit' }}
                    _focus={{ boxShadow: 'none' }}
                    onChange={handleKeywordListChange}
                    readOnly={isReadOnly(64)}
                    value={keywordList}
                  ></Textarea>
                  <Box bgColor={'#FAFAFA'} w={'100%'} mb="20px" pt={'5px'} pb={'5px'}>
                    <Text color='black' fontSize={'12px'} >
                      ☞ 입력형식 : 키워드=패턴(라인단위 키워드 혹은 정규표현식), 입력 예) 비번=비밀번호, 문자열=([a-zA-Z]*($|[^A-Za-z0-9]))
                    </Text>
                  </Box>
                </Box>
              </Flex> */}
              <Flex mb='10px'>
                <Alert fontSize='sm' backgroundColor={'#FAFAFA'} borderRadius='5px' fontWeight='600'>
                  <AlertIcon color={'blue.500'} alignSelf={'start'} />
                  체크 마크하신 항목만 Agent 동기화 대상입니다. <br />
                  특히 서버 IP나 서버 Port가 변경되면 현 Server와 Agent간 통신이 바로 차단될 수 있습니다.
                </Alert>
              </Flex>
            </FormControl>
          </form>
        </Flex>
      </Flex>
    </Card >
  );
}
