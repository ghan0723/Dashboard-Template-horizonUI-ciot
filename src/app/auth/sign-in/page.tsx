'use client';
/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useEffect, useState } from 'react';
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import DefaultAuthLayout from 'layouts/auth/Default';
// Assets
import Link from 'next/link';
import { MdLock, MdOutlineRemoveRedEye, MdPersonOutline } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { backIP, frontIP } from 'utils/ipDomain';
import Swal from 'sweetalert2';
import styles from "../../../styles/Swal.module.css"

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [show, setShow] = React.useState(false);
  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');
  const handleClick = () => setShow(!show);
  const router = useRouter();
  const handleUsernameChange = (e: any) => {
    const nameValue = e.target.value;
    setUsername(nameValue);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPasswd(passwordValue);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // 클라이언트 측에서 직접 API로 데이터 전송
    try {
      const response = await fetch(`${backIP}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, passwd }),
        credentials: 'include', // or 'same-origin' depending on your CORS setup
      });

      const result = await response.json();
      if (response.ok) {
        // 로그인 성공 시 넘어온 값에 따라서 바로 dashboard로 이동할지 아니면 비밀번호 변경 페이지로 이동할지
        if (result.freq) {
          router.push(`/pwd/freq?username=${result.username}`);
        } else {
          if (result.notice) {
            window.open(`${frontIP}/notice/popup`, "_blank", "width=600,height=150,top=100,left=50, resizable=no, menubar=no");
            //팝업창에 데이터 넣기
            router.push('/dashboard/default');
          } else {
            router.push('/dashboard/default');
          }
        }
      } else {
        if (result.enabled !== undefined && result.enabled === false) {
          Swal.fire({
            title: '로그인 오류',
            html: `<div style="font-size: 14px;">비밀번호를 5회 이상 틀렸습니다. <br />관리자가 해제하기 전까지 접속이 불가능합니다.</div>`,
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
        } else {
          // 로그인 실패 시 에러 처리
          Swal.fire({
            title: '로그인 오류',
            html: `<div style="font-size: 14px;">계정명 혹은 비밀번호가 일치하지 않습니다. <br />입력한 내용을 다시 확인해 주세요.</div>`,
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
      }
    } catch (error) {
    }
  };

  return (
    <DefaultAuthLayout
      illustrationBackground={'/img/auth/auth.png'}
    >
      <Flex
        // maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        mt={{ base: '40px', md: '14vh' }}
        p={'15px'}
        flexDirection="column"
      >
        {/* <Box me="auto"> */}
        <Box>
          <Heading color={textColor} fontSize="40px" mb="25px">
            Weasel
          </Heading>
        </Box>
        <Flex
          alignContent="center"
          alignItems="center"
          justifyContent="center"
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '400px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset', md: '-10vw' }}
          me="auto"
          mb={{ base: '20px', md: '15vh' }}
        >
          <form method='post' action={`${backIP}/user/login`} onSubmit={handleSubmit}>
            <FormControl>
              <InputGroup size={"md"}>
                <InputLeftElement
                  display="flex" alignItems="center" mt="4px"
                >
                  <Icon
                    boxSize={'20px'}
                    color={textColorSecondary}
                    as={MdPersonOutline}
                  />
                </InputLeftElement>
                <Input
                  id='username'
                  name='username'
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: '0px', md: '0px' }}
                  type="text"
                  placeholder="사용자 계정명"
                  fontWeight="500"
                  size="lg"
                  onChange={handleUsernameChange}
                  borderRadius={'md'}
                />
              </InputGroup>
              <InputGroup size="md">
                <InputLeftElement
                  display="flex" alignItems="center" mt="4px"
                >
                  <Icon
                    boxSize={'20px'}
                    color={textColorSecondary}
                    as={MdLock}
                  />
                </InputLeftElement>
                <Input
                  id='passwd'
                  name='passwd'
                  isRequired={true}
                  fontSize="sm"
                  placeholder="비밀번호"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  onChange={handlePasswordChange}
                  borderRadius={'md'}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Button
                type='submit'
                fontSize="larger"
                variant="blue"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                borderRadius={'md'}
              >
                로그인
              </Button>
            </FormControl>
          </form>
        </Flex>
      </Flex>
      {/* 여기에 모달 컴포넌트 추가해서 질문하는 */}
    </DefaultAuthLayout>
  );
}
