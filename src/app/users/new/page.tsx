'use client';

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
import { getNameCookie } from 'utils/cookie';
import { useRouter } from 'next/navigation';
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
    const [range, setRange] = React.useState('');
    const [cookieName, setCookieName] = React.useState('');
    const [cookiePrivilege, setCookiePrivilege] = React.useState<number>();
    const [cookieRange, setCookieRange] = React.useState('');
    const [cookieId, setCookieId] = React.useState<number>();
    const router = useRouter();

    React.useEffect(() => {
        fetchPrivilegeAndRange();
    }, [cookiePrivilege]);

    const fetchPrivilegeAndRange = async () => {
        const usernameCookie = await getNameCookie();
        await setCookieName(usernameCookie);
        try {
            const response = await fetch(`${backIP}/user/check?username=` + usernameCookie);
            const result = await response.json();
            setCookiePrivilege(result[0].privilege);
            setCookieRange(result[0].ip_ranges);
            setPrivilege((result[0].privilege === 1 && result[0].id === 1) ? '1' : (result[0].privilege === 1 ? '2' : '3'));
            setCookieId(result[0].id);
        } catch (error) {
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

    const handlePrivilegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPrivilege = e.target.value;
        setPrivilege(selectedPrivilege);
    };

    const handleRangeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const selectedRange = e.target.value;
        setRange(selectedRange);
    };

    function validateIPRange(ipRange: string): boolean {
        let   checkFlag:boolean;
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
        const ipRangeRegex = /^(\d{1,3}\.){3}\d{1,3}-(\d{1,3}\.){3}\d{1,3}$/;
        // 사용자 입력을 줄바꿈 또는 쉼표를 기준으로 자릅니다.
        const inputs: string[] = ipRange.trim().split(/[\r\n,]+\s*/);
        //현재 로그인 한 아이디의 IP 대역을 계산한다.
        const cookieIPs: string[] = cookieRange.trim().split(/[\r\n,]+\s*/);
        
        // 각 입력에 대해 형식을 검사합니다.
        for (const input of inputs) {
            for (const cookieIP of cookieIPs) {
                // index = 0;
                // checkFlag = [];
                checkFlag = true;
                if (ipRangeRegex.test(input)) {
                    // checkFlag.push(true);
                    
                    // 입력값이 ip 일때
                    const ipAddresses: string[] = input.split("-");
                    const startIP: string[] = ipAddresses[0].trim().split(".");
                    const endIP: string[] = ipAddresses[1].trim().split(".");
                    if(ipRangeRegex.test(cookieIP)){
                        //쿠키가 ip 일때
                        const cookieIpAddresses: string[] = cookieIP.split("-");
                        const cookieStartIP: string[] = cookieIpAddresses[0].trim().split(".");
                        const cookieEndIP: string[] = cookieIpAddresses[1].trim().split(".");
                        // IP 주소의 각 자리수를 확인하고 유효한지 검사합니다.
                        function isValidIPAddress(ip: string[]): boolean {
                            return ip.every(part => /^\d+$/.test(part) && parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
                        }
                        // 시작 IP 주소와 끝 IP 주소가 유효한지 확인합니다.
                        if (startIP.length !== 4 || endIP.length !== 4 || !isValidIPAddress(startIP) || !isValidIPAddress(endIP)) {
                            checkFlag = false;
                        }
                        

                        // 시작 IP 주소가 끝 IP 주소보다 작은지 확인합니다.
                        for (let i = 0; i < 4; i++) {
                            if ((parseInt(startIP[i], 10) < parseInt(cookieStartIP[i], 10)) || (parseInt(endIP[i], 10) > parseInt(cookieEndIP[i], 10)) || (parseInt(startIP[i], 10) > parseInt(endIP[i], 10))) {
                                checkFlag = false;
                                if(!checkFlag) break;
                            }
                        }
                    } else if (cidrRegex.test(cookieIP)){
                        //쿠키가 cidr일때
                        const [ip, cidr] = cookieIP.split("/");
                        const parts = ip.split(".").map(part => parseInt(part, 10));
                        const cidrBits = parseInt(cidr, 10);
                        const cidrMask = (0xffffffff << (32 - cidrBits)) >>> 0;
                        const startIpParts = parts.map((part, index) => part & ((cidrMask >> (24 - 8 * index)) & 0xff));
                        const endIpParts = parts.map((part, index) => part | ((~cidrMask >> (24 - 8 * index)) & 0xff));

                        // IP 주소의 각 자리수를 확인하고 유효한지 검사합니다.
                        function isValidIPAddress(ip: string[]): boolean {
                            return ip.every(part => /^\d+$/.test(part) && parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
                        }

                        // 시작 IP 주소와 끝 IP 주소가 유효한지 확인합니다.
                        if (startIP.length !== 4 || endIP.length !== 4 || !isValidIPAddress(startIP) || !isValidIPAddress(endIP)) {
                            checkFlag = false;
                        }

                        // 시작 IP 주소가 끝 IP 주소보다 작은지 확인합니다.
                        for (let i = 0; i < 4; i++) {
                            if ((parseInt(startIP[i], 10) < startIpParts[i]) || (parseInt(endIP[i], 10) > endIpParts[i]) || (parseInt(startIP[i], 10) > parseInt(endIP[i], 10))) {
                                checkFlag = false;
                                if(!checkFlag) break;
                            }
                        }
                    }                    

                    if(checkFlag) break;
                } else if (cidrRegex.test(input)) {
                    //입력값이 cidr일때
                    const [ip, cidr] = input.split("/");
                    const parts = ip.split(".").map(part => parseInt(part, 10));
                    const cidrBits = parseInt(cidr, 10);
                    const cidrMask = (0xffffffff << (32 - cidrBits)) >>> 0;
                    const startIpParts = parts.map((part, index) => part & ((cidrMask >> (24 - 8 * index)) & 0xff));
                    const endIpParts = parts.map((part, index) => part | ((~cidrMask >> (24 - 8 * index)) & 0xff));
                    if(cidrRegex.test(cookieIP)){
                        //쿠키도 cidr일때
                        const [cookieip, cookieCidr] = cookieIP.split("/");
                        const cookieParts = cookieip.split(".").map(part => parseInt(part, 10));
                        const cookieCidrBits = parseInt(cookieCidr, 10);
                        const cookieCidrMask = (0xffffffff << (32 - cookieCidrBits)) >>> 0;
                        const cookieStartIP = cookieParts.map((part, index) => part & ((cookieCidrMask >> (24 - 8 * index)) & 0xff));
                        const cookieEndIP = cookieParts.map((part, index) => part | ((~cookieCidrMask >> (24 - 8 * index)) & 0xff));
                        if (parts.some(part => isNaN(part) || part < 0 || part > 255)) {
                            checkFlag = false; // IP 주소의 각 자리수가 0에서 255 사이의 값을 가져야 합니다.
                        } 
                        const cidrValue = parseInt(cidr, 10);
                        if (isNaN(cidrValue) || cidrValue < 0 || cidrValue > 32 ) {
                        // || cidrValue % 8 !== 0) {
                            checkFlag = false; // CIDR 접두사는 0에서 32 사이의 값을 가져야 하며, 8의 배수여야 합니다.
                        }
                        for(let i = 0; i< parts.length; i++){
                            if(startIpParts[i] < cookieStartIP[i] || endIpParts[i] > cookieEndIP[i]){
                                checkFlag = false;
                                if(!checkFlag) break;
                            }
                        }
                    } else if (ipRangeRegex.test(cookieIP)){
                        //쿠키가 그냥ip일때
                        const cookieIpAddresses: string[] = cookieIP.split("-");
                        const cookieStartIP: string[] = cookieIpAddresses[0].trim().split(".");
                        const cookieEndIP: string[] = cookieIpAddresses[1].trim().split(".");
                        if (parts.some(part => isNaN(part) || part < 0 || part > 255)) {
                            checkFlag = false; // IP 주소의 각 자리수가 0에서 255 사이의 값을 가져야 합니다.
                        } 
                        const cidrValue = parseInt(cidr, 10);
                        if (isNaN(cidrValue) || cidrValue < 0 || cidrValue > 32 ) {
                        // || cidrValue % 8 !== 0) {
                            checkFlag = false; // CIDR 접두사는 0에서 32 사이의 값을 가져야 하며, 8의 배수여야 합니다.
                        }
                        for(let i = 0; i< parts.length; i++){
                            if(startIpParts[i] < parseInt(cookieStartIP[i], 10) || endIpParts[i] > parseInt(cookieEndIP[i], 10)){
                                checkFlag = false;
                                if(!checkFlag) break;
                            }
                        }
                    }

                    if(checkFlag) break;
                } else {
                    checkFlag = false;
                }

                if(checkFlag) break;
            }

            if(checkFlag===false) break;
        }
        return checkFlag;
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+=\[\]{}`|;:'"<>,.?/]).{8,15}$/;
        // 폼 제출 시 사용자 계정명과 비밀번호의 길이를 다시 확인

        if (username.length < 5 || username.length > 15) {
            userSwal(1, 'new');
            event.preventDefault();
        } else if (!passwordRegex.test(passwd)) {
            userSwal(2, 'new');
            event.preventDefault();
        } else if (passwd !== passwdChk) {
            //비밀번호와 비밀번호 확인을 비교하여 같으면 통과
            userSwal(3, 'new');
            event.preventDefault();
        } else if (range.length === 0) {
            userSwal(5, 'new');
            event.preventDefault();
        } else if (!validateIPRange(range)) {
            userSwal(99, "new", '#d33', "IP 대역의 값이 올바르지 않습니다. 다시 입력해주세요.");
            event.preventDefault();
        } else {
            try {
                Swal.fire({
                    title: '사용자 계정 생성',
                    html: `<div style="font-size: 14px;">정말 이대로 계정을 생성하시겠습니까?</div>`,
                    confirmButtonText: '생성',
                    confirmButtonColor: 'orange',
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
                            const response = await fetch(`${backIP}/user/add`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    username: username,
                                    passwd: passwd,
                                    privilege: privilege,
                                    range: range,
                                    cookie: cookieName,
                                })
                            });

                            if (response.ok) {
                                router.push('/users/control');
                            } else {
                                const result: any = await response.json();
                                userSwal(99, 'new', '#d33', result.error);
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
        <DefaultAuthLayout
            illustrationBackground={'/img/auth/auth.png'}
        >
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
                        사용자 계정 추가
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
                    border={'1px solid #ccc'}
                    p={'5'}
                    pb={'0'}
                >
                    <form method='post' action={`${backIP}/user/add`}
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
                                placeholder="최소 5자 이상 최대 15자 이하"
                                mb="24px"
                                fontWeight="500"
                                size="lg"
                                onChange={handleUsernameChange}
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
                                onChange={handlePrivilegeChange}
                            >
                                {
                                    cookiePrivilege !== 1 ?
                                        <option value="3">모니터</option>
                                        : (cookieId !== 1 ?
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
                                h='180px'
                                resize='none'
                                placeholder={cookieRange}
                                onChange={handleRangeChange}
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
                        추가
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
