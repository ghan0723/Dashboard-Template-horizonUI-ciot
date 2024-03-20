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
import { getNameCookie } from 'utils/cookie';
import { backIP } from 'utils/ipDomain';
import { userSwal } from 'components/swal/customSwal';
import Swal from 'sweetalert2';

export default function SignIn() {
    // Chakra color mode
    const textColor = useColorModeValue('navy.700', 'white');
    const textColorSecondary = 'gray.400';
    const brandStars = useColorModeValue('brand.500', 'brand.400');
    const [show, setShow] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [passwd, setPasswd] = React.useState('');
    const [passwdChk, setPasswdChk] = React.useState('');
    const [privilege, setPrivilege] = React.useState('');
    const [mngRange, setMngRange] = React.useState('');
    const [enabled, setEnabled] = React.useState();
    const [oldName, setOldName] = React.useState('');
    const [cookieName, setCookieName] = React.useState('');
    const [cookiePrivilege, setCookiePrivilege] = React.useState();
    const [cookieRange, setCookieRange] = React.useState('');
    const [cookieId, setCookieId] = React.useState<number>();
    const router = useRouter();
    React.useEffect(() => {

        // URL에서 query parameter를 추출
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        // params에서 원하는 값을 추출
        const name = params.name;
        const fetchUser = async () => {
            try {
                const response = await fetch(`${backIP}/user/modify/` + name);
                const result = await response.json();
                setUsername(result[0].username);
                setOldName(result[0].username);
                setPasswd(result[0].passwd);
                setPrivilege(result[0].privilege);
                setMngRange(result[0].ip_ranges.replace(/,\s*/g, "\n"));
                setEnabled(result[0].enabled);
            } catch (error) {
                console.log(' error 발생 : ' + error);
            }
        }
        if (name) {
            fetchUser();
            fetchPrivilegeAndRange();
        }
    }, [cookieName]);

    const fetchPrivilegeAndRange = async () => {
        const username = await getNameCookie();
        setCookieName(username);
        try {
            const response = await fetch(`${backIP}/user/check?username=` + username);
            const result = await response.json();
            setCookiePrivilege(result[0].privilege);
            setCookieRange(result[0].ip_ranges);
            setCookieId(result[0].id);
        } catch (error) {
            console.log('error 발생 : ' + error);
        }
    }
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

    const handleMngRangeChange = (e: any) => {
        const mngValue = e.target.value;
        setMngRange(mngValue);
    }

    const handlePrivilegeChange = (event: any) => {
        const selectedPrivilege = event.target.value;
        // 선택한 등급에 대한 처리 로직을 여기에 추가합니다.
        setPrivilege(selectedPrivilege); // 예를 들어 state에 저장하거나 다른 작업을 수행할 수 있습니다.
    };

    const handleEnabledChange = (e: any) => {
        const enabledValue = e.target.value;
        setEnabled(enabledValue);
    }

    function validateIPRange(ipRange: string): boolean {
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
        const ipRangeRegex = /^(\d{1,3}\.){3}\d{1,3}-(\d{1,3}\.){3}\d{1,3}$/;
    
        // 사용자 입력을 줄바꿈 또는 쉼표를 기준으로 자릅니다.
        const inputs: string[] = ipRange.trim().split(/[\r\n,]+\s*/);
        // 각 입력에 대해 형식을 검사합니다.
        for (const input of inputs) {
            if (ipRangeRegex.test(input)) {
                // IP 대역을 "-"로 분할하여 시작과 끝 IP 주소를 추출합니다.
                const ipAddresses: string[] = input.split("-");
                const startIP: string[] = ipAddresses[0].trim().split(".");
                const endIP: string[] = ipAddresses[1].trim().split(".");
                // IP 주소의 각 자리수를 확인하고 유효한지 검사합니다.
                function isValidIPAddress(ip: string[]): boolean {
                    return ip.every(part => /^\d+$/.test(part) && parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
                }
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
                if (parts.some(part => isNaN(part) || part < 0 || part > 255)) {
                    return false; // IP 주소의 각 자리수가 0에서 255 사이의 값을 가져야 합니다.
                }
                const cidrValue = parseInt(cidr, 10);
                if (isNaN(cidrValue) || cidrValue <= 0 || cidrValue >= 32 || cidrValue % 8 !== 0) {
                    return false; // CIDR 접두사는 0에서 32 사이의 값을 가져야 하며, 8의 배수여야 합니다.
                }
            } else {
                return false;
            }
        }
        return true;
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+=\[\]{}`|;:‘“<>,.?/]).{8,15}$/;
        
        // 폼 제출 시 사용자 계정명과 비밀번호의 길이를 다시 확인
        if (username.length < 5 || username.length > 15) {
            userSwal(1, 'modify');
            event.preventDefault();
        } else if (!passwordRegex.test(passwd)) {
            userSwal(2, 'modify');
            event.preventDefault();
        } else if (passwd !== passwdChk) {
            //비밀번호와 비밀번호 확인을 비교하여 같으면 통과
            userSwal(3, 'modify');
            event.preventDefault();
        } else if (mngRange.length === 0) {
            userSwal(5, 'modify');
            event.preventDefault();
        } else if (!validateIPRange(mngRange)){
            userSwal(99, "modify", '#d33', "IP 대역의 값이 올바르지 않습니다. 다시 입력해주세요.");
            event.preventDefault();
        } else {
            try {
                Swal.fire({
                    title: '사용자 계정 수정',
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
                })
                    .then(async (result) => {
                        if (result.isConfirmed) {
                            const response = await fetch(`${backIP}/user/update/${oldName}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    username: username,
                                    passwd: passwd,
                                    privilege: privilege,
                                    mngRange: mngRange,
                                    cookie: cookieName,
                                    enabled: enabled,
                                })
                            })
                            if (response.ok) {
                                router.push('/users/control');
                            } else {
                                const result: any = await response.json();
                                userSwal(99, 'modify', '#d33', result.error);
                            }
                        } else {
                        }
                    })
            } catch (error) {
                alert("에러 확인 : " + error);
            }
        }
    };

    return (
        <DefaultAuthLayout>
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
                mt={{ base: '40px', md: '3vh' }}
                flexDirection="column"
            >
                <Box>
                    <Heading color={textColor} fontSize="36px" mb="20px">
                        사용자 계정 수정
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
                    <form method='post' action={`${backIP}/user/update/${oldName}`}
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
                                onChange={(event) => handlePrivilegeChange(event)}
                            >
                                {
                                    cookiePrivilege !== 1 ?
                                        <option value="3">모니터</option>
                                        : ( cookieId !== 1 ? 
                                        <>
                                            <option value="2">영역별 관리자</option>
                                            <option value="3">모니터</option>
                                        </> : 
                                        <>
                                        <option value="1">관리자</option>
                                        <option value="2">영역별 관리자</option>
                                        <option value="3">모니터</option>
                                        </>
                                        )
                                }
                            </Select>
                            <Box display={cookiePrivilege === 1 ? "block" : 'none'}>
                                <FormLabel
                                    display="flex"
                                    ms="4px"
                                    fontSize="sm"
                                    fontWeight="500"
                                    color={textColor}
                                    mb="8px"
                                >
                                    사용자 상태<Text color={brandStars}>*</Text>
                                </FormLabel>
                                <Select
                                    id="enabled"
                                    name="enabled"
                                    isRequired={true}
                                    variant="auth"
                                    fontSize="sm"
                                    ms={{ base: '0px', md: '0px' }}
                                    mb="24px"
                                    fontWeight="500"
                                    size="lg"
                                    value={enabled}
                                    onChange={(event) => handleEnabledChange(event)}
                                >
                                    <option value="0">비활성화</option>
                                    <option value="1">활성화</option>
                                </Select>
                            </Box>
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
                                h='130px'
                                resize='none'
                                value={mngRange}
                                placeholder={cookieRange}
                                onChange={handleMngRangeChange}
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
                        </FormControl>
                    </form>
                </Flex>
                <Flex w={'100%'} justifyContent={'center'} mt={'2'}>
                    <Button
                        className='swal2-confirm'
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
