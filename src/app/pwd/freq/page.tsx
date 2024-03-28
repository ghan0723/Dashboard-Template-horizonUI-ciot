'use client';
/* eslint-disable */

import React from 'react';
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
  InputRightElement,
  Select,
  Text,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
// Assets
import { MdLock, MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { useRouter, useSearchParams } from 'next/navigation';
import { backIP, frontIP } from 'utils/ipDomain';
import { userSwal } from 'components/swal/customSwal';
import { getNameCookie } from 'utils/cookie';

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const [show, setShow] = React.useState(false);
  const [oldPwd, setOldPwd] = React.useState('');
  const [passwd, setPasswd] = React.useState('');
  const [passwdChk, setPasswdChk] = React.useState('');
  const router = useRouter();
  const username = useSearchParams().get('username');
  const handleClick = () => setShow(!show);

  const handleOldPwdChange = (e: any) => {
    const nameValue = e.target.value;
    setOldPwd(nameValue);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPasswd(passwordValue);
  };


  const handlePasswdChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwdChkValue = e.target.value;
    //비밀번호 확인을 state에 저장시키기
    setPasswdChk(pwdChkValue);

  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // 폼 제출 시 사용자 계정명과 비밀번호의 길이를 다시 확인
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+=\[\]{}`|;:'"<>,.?/]).{8,15}$/;

    if (!passwordRegex.test(passwd)) {
      userSwal(2, 'edit');
      event.preventDefault();
    } else if (passwd !== passwdChk) {
      //비밀번호와 비밀번호 확인을 비교하여 같으면 통과
      userSwal(3, 'edit');
      event.preventDefault();
    } else {
      const response = await fetch(`${backIP}/user/pwd?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPwd: passwd,
          oldPwd: oldPwd
        })
      });


      if (response.ok) {
        router.push('/auth/sign-in');
      } else {
        if(response.status === 401) {
          userSwal(4,'edit');
        } else if(response.status === 403) {
          const result: any = await response.json();
          userSwal(99,'edit','#d33', result.error);
        } else {
          const result: any = await response.json();
          userSwal(99,'edit','#d33',result.error);
        }
      }
    }
  };

  return (
    // <DefaultAuthLayout illustrationBackground={'/img/auth/auth.png'}>
    <Flex alignContent={'center'} justifyContent={'center'} w={'100vw'} h="100vh">
      <Flex
        w="100%"
        mt={'5%'}
        h={'100vh'}
        alignContent="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
        backgroundColor={'white'}
      >

        <Flex mb="15px" pl={'5%'} pt={'20'} pb={'10'} alignItems="center">
          <MdLock size={'100px'} color='#0197E4' />
          <Flex direction="column" pl={'5px'}>
            <Text color={textColor} fontSize={'4xl'} fontWeight={'700'}>
              보다 안전한 서비스 이용을 위해
            </Text>
            <Flex>
              <Text as="span" color={'#0197E4'} fontSize={'4xl'} fontWeight={'700'}>비밀번호를 변경 </Text>
              <Text as="span" color='black' fontSize={'4xl'} fontWeight={'700'}>하세요.</Text>
            </Flex>
          </Flex>
        </Flex>
        <Box>
          <Flex
            zIndex="2"
            direction="column"
            w={'100%'}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            alignContent={'center'}
            justifyItems={'center'}
            me="auto"
            mb={{ base: '20px', md: 'auto' }}
          >
            <form method='post' action={`${backIP}/profile/update/${username}`}
              onSubmit={handleSubmit} style={{ alignItems: 'center', justifyItems: 'center' }}>
              <FormControl w={'75%'} justifySelf={'center'} margin={'0 auto'}>
                <Box borderTop={'3px solid #DFDFDF'} backgroundColor={'#F9F9F9'}
                  pt={'5%'} pl={'5%'} pr={'5%'} pb={'3%'}
                  mb={'50px'}
                >
                  <Flex>
                    <FormLabel w={'150px'}>
                      <Text fontSize={'15px'} lineHeight={'10'}>현재 비밀번호</Text>
                    </FormLabel>
                    <InputGroup size="md" w={'50%'}>
                      <Input
                        id='username'
                        name='username'
                        isRequired={true}
                        variant="auth"
                        fontSize="sm"
                        ms={{ base: '0px', md: '0px' }}
                        type={show ? 'text' : 'password'}
                        mb="24px"
                        fontWeight="500"
                        size="lg"
                        onChange={handleOldPwdChange}
                        value={oldPwd}
                        backgroundColor={'white'}
                        borderRadius={'none'}
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
                  </Flex>
                  <Flex>
                    <FormLabel w={'150px'}>
                      <Text fontSize={'15px'} lineHeight={'10'}>새 비밀번호</Text>
                    </FormLabel>
                    <InputGroup size="md" w={'50%'}>
                      <Input
                        id='passwd'
                        name='passwd'
                        isRequired={true}
                        fontSize="sm"
                        mb="24px"
                        size="lg"
                        type={show ? 'text' : 'password'}
                        variant="auth"
                        onChange={handlePasswordChange}
                        value={passwd}
                        backgroundColor={'white'}
                        borderRadius={'none'}
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
                    <Text lineHeight={'10'} ml={'10px'} color={'#A09997'}>
                      8 ~ 16자리로 영문 대소문자, 숫자, 특수문자 조합
                    </Text>
                  </Flex>
                  <Flex>
                    <FormLabel w={'150px'}>
                      <Text fontSize={'15px'} lineHeight={'10'}>새 비밀번호 확인</Text>
                    </FormLabel>
                    <InputGroup size="md" w={'50%'}>
                      <Input
                        id='passwdChk'
                        name='passwdChk'
                        isRequired={true}
                        fontSize="sm"
                        mb="24px"
                        size="lg"
                        type={show ? 'text' : 'password'}
                        variant="auth"
                        backgroundColor={'white'}
                        borderRadius={'none'}
                        onChange={handlePasswdChkChange}
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
                    <Text lineHeight={'10'} ml={'10px'} color={'#A09997'}>
                      공백문자는 사용 불가
                    </Text>



                  </Flex>
                </Box>
                <Flex justifyContent={'center'}>
                  <Button
                    type='submit'
                    fontSize="lg"
                    fontWeight="700"
                    w={'20%'}
                    h="50"
                    borderRadius={'none'}
                    backgroundColor={'#0197E4'}
                    color={'white'}
                    _hover={{
                      backgroundColor: "white",
                      color: '#0197E4'
                    }}
                  >
                    변경하기
                  </Button>
                  <Button
                    type='reset'
                    fontSize="lg"
                    fontWeight="700"
                    w={'20%'}
                    h="50"
                    borderRadius={'none'}
                    backgroundColor={'white'}
                    color={'#EE5D50'}
                    _hover={{
                      backgroundColor: '#EE5D50',
                      color: 'white',
                    }}
                    onClick={() => window.location.href = `${frontIP}/auth/sign-in`}
                  >
                    취소하기
                  </Button>
                </Flex>
              </FormControl>
            </form>
          </Flex>
        </Box>
      </Flex>
    </Flex>
    // </DefaultAuthLayout>
  );
}
