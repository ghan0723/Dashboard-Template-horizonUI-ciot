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
import DefaultAuthLayout from 'layouts/auth/Default';
// Assets
import Link from 'next/link';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

import { useParams, useRouter } from 'next/navigation';
import { deleteCookie, getCookie, getNameCookie } from 'utils/cookie';
import { backIP } from 'utils/ipDomain';
import { userSwal } from 'components/swal/customSwal';
import Swal from 'sweetalert2';

export default function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [show, setShow] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [passwd, setPasswd] = React.useState('');
  const [passwdChk, setPasswdChk] = React.useState('');
  const [privilege, setPrivilege] = React.useState();
  const [mngRange, setMngRange] = React.useState('');
  const [oldName, setOldName] = React.useState('');
  const [freq, setFreq] = React.useState();
  const router = useRouter();
  React.useEffect(() => {
    getNameCookie().then((userNameCookie) => {

      if (userNameCookie) {
        fetch(`${backIP}/profile/edit/` + userNameCookie)
          .then((response) => response.json())
          .then((result) => {
            setUsername(result[0].username);
            setOldName(result[0].username);
            setPasswd(result[0].passwd);
            setPrivilege(result[0].privilege);
            setMngRange(result[0].ip_ranges);
            setFreq(result[0].pwd_change_freq);
          })
          .catch((error) => {
          });
      }
    });
  }, []);

  const handleClick = () => setShow(!show);

  const handleUsernameChange = (e: any) => {
    const nameValue = e.target.value;
    setUsername(nameValue);
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

  const handleFreqChange = (event: any) => {
    const selectedFreq = event.target.value;
    // 선택한 등급에 대한 처리 로직을 여기에 추가합니다.
    setFreq(selectedFreq); // 예를 들어 state에 저장하거나 다른 작업을 수행할 수 있습니다.
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // 폼 제출 시 사용자 계정명과 비밀번호의 길이를 다시 확인
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+=\[\]{}`|;:‘“<>,.?/]).{8,15}$/;

    if (username.length < 5 || username.length > 15) {
      userSwal(1, 'edit');
      event.preventDefault();
    } else if (!passwordRegex.test(passwd)) {
      userSwal(2, 'edit');
      event.preventDefault();
    } else if (passwd !== passwdChk) {
      //비밀번호와 비밀번호 확인을 비교하여 같으면 통과
      userSwal(3, 'edit');
      event.preventDefault();
    } else {
      try {
        Swal.fire({
          title: '본인 정보 수정',
          html: `<div style="font-size: 14px;">정말 이대로 계정을 수정하시겠습니까?</div>`,
          confirmButtonText: '수정',
          confirmButtonColor: 'blue.200',
          focusConfirm: false,
          cancelButtonText: '닫기',
          showCancelButton: true,
          customClass: {
            popup: 'custom-popup-class',
            title: 'custom-title-class',
            htmlContainer: 'custom-content-class',
            container: 'custom-content-class',
            confirmButton: 'custom-confirm-button-class'
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await fetch(`${backIP}/profile/update/${oldName}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: username,
                passwd: passwd,
                freq: freq
              })
            })

            if (response.ok) {
              deleteCookie('username');
              router.push('/auth/sign-in');
            } else {
              const result: any = await response.json();
              userSwal(99, 'edit', '#d33', result.error);
            }
          }
        })
      } catch (error) {
        alert("에러 확인 : " + error);
      }
    }
  };

  return (
    <DefaultAuthLayout illustrationBackground={'/img/auth/auth.png'} >
      <Flex
        w="100%"
        mx={{ base: 'auto', lg: '0px' }}
        me="auto"
        h="100%"
        alignContent="center"
        alignItems="center"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '5vh' }}
        flexDirection="column"
      >
        <Box>
          <Heading color={textColor} fontSize="36px" mb="20px">
            본인 정보 수정
          </Heading>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '450px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          // mb={'20px'}
          border={'1px solid #ccc'}
          p={'5'}
          pb={'0'}
        >
          <form method='post' action={`${backIP}/profile/update/${oldName}`}
            onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                사용자 계정명<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                id='username'
                name='username'
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={handleUsernameChange}
                value={username}
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                비밀번호<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  id='passwd'
                  name='passwd'
                  isRequired={true}
                  fontSize="sm"
                  placeholder="비밀번호는 8자리 이상"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  onChange={handlePasswordChange}
                  value={passwd}
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
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                비밀번호 확인<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  id='passwdChk'
                  name='passwdChk'
                  isRequired={true}
                  fontSize="sm"
                  placeholder="비밀번호를 다시 한번 입력해주세요"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
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
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                사용자 권한<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                id="privilege"
                name="privilege"
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                mb="24px"
                fontWeight="500"
                size="lg"
                value={privilege}
                isReadOnly
                style={{ pointerEvents: 'none', userSelect: 'none', cursor: 'default' }}
                _hover={{ borderColor: 'inherit' }}
                _focus={{ boxShadow: 'none' }}
                backgroundColor={"#DDDDDD"}
                color={"#555555"}
              >
                {/* 여기에 옵션을 추가합니다 */}
                <option value="1">관리자</option>
                <option value="2">영역별 관리자</option>
                <option value="3">모니터</option>
              </Select>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                관리 대역 설정<Text color={brandStars}>*</Text>
              </FormLabel>
              <Textarea
                name='ip_ranges'
                id='ip_ranges'
                w='100%'
                h='120px'
                mb='10px'
                resize='none'
                value={mngRange}
                readOnly
                style={{ pointerEvents: 'none', userSelect: 'none', cursor: 'default' }}
                _hover={{ borderColor: 'inherit' }}
                _focus={{ boxShadow: 'none' }}
                backgroundColor={"#DDDDDD"}
                color={"#555555"}
              >
              </Textarea>
              <Box bgColor={'#FAFAFA'} mb="20px" pt={'5px'} pb={'5px'}>
                <Text color='black' fontSize={'12px'} >
                    ☞ 입력형식 : CIDR 혹은 Range(라인단위 IP범위)
                </Text>
                <Text color='black' fontSize={'12px'} ml={'15px'}>
                    입력 예) CIDR형식 : 192.168.0.0/16, Range형식 : 192.168.10.1-192.168.10.254
                </Text>
              </Box>
              <FormLabel
                display={privilege === 1 ? "flex" : 'none'}
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                날짜 변경 기한<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                id="pwd_change_freq"
                name="pwd_change_freq"
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                mb="10px"
                fontWeight="500"
                size="lg"
                value={freq}
                onChange={(event) => handleFreqChange(event)}
                display={privilege !== 1 ? "none" : ""}
              >
                {/* 여기에 옵션을 추가합니다 */}
                <option value="1">1개월</option>
                <option value="2">2개월</option>
                <option value="3">3개월</option>
                <option value="4">4개월</option>
                <option value="5">5개월</option>
                <option value="6">6개월</option>
                <option value="7">7개월</option>
                <option value="8">8개월</option>
                <option value="9">9개월</option>
                <option value="10">10개월</option>
                <option value="11">11개월</option>
                <option value="12">12개월</option>

              </Select>
            </FormControl>
          </form>
        </Flex>
        <Flex w={'100%'} justifyContent={'center'} mt={'2'}>
          <Button
            type='submit'
            fontSize="12px"
            bgColor={"white"}
            color={'#aaa'}
            border={'1px solid #ccc'} 
            _focus={{ boxShadow: 'none' }}
            _active={{ boxShadow: 'none' }}
            borderRadius={'md'}
            w="80px"
            h="25px"
            p={'3'}
            onClick={handleSubmit}
          >
            수정
          </Button>
          <Button
            type='button'
            fontSize="12px"
            bgColor={"white"}
            color={'black'}
            border={'1px solid #ccc'}
            outline={'none'}
            _focus={{ boxShadow: 'none' }}
            _active={{ boxShadow: 'none' }}
            borderRadius={'md'}
            onClick={() => router.back()}
            w="80px"
            h="25px"
            p={'3'}
            ml={'2'}
          >
            취소
          </Button>
        </Flex>
      </Flex>
    </DefaultAuthLayout>
  );
}
