// IP 주소의 각 자리수를 확인하고 유효한지 검사합니다.
export function isValidIPAddress(ip: string[]): boolean {
    return ip.every(part => /^\d+$/.test(part) && parseInt(part, 10) >= 0 && parseInt(part, 10) <= 255);
}

export function compareRange(startip:string[], endip:string[]): boolean{
    for(let i=0; i<startip.length; i++){
        if(parseInt(startip[i], 10) < parseInt(endip[i], 10)){
            return false;
        } else if (parseInt(startip[i], 10) > parseInt(endip[i], 10)){
            return true;
        }
    }
    return true;
}

export function validateIPRange(ipRange: string, cookieRange:string): boolean {
    let   i = 0;
    let   comStartFlag:boolean;
    let   comEndFlag:boolean;
    const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    const ipRangeRegex = /^(\d{1,3}\.){3}\d{1,3}-(\d{1,3}\.){3}\d{1,3}$/;

    // 사용자 입력을 줄바꿈 또는 쉼표를 기준으로 자릅니다.
    const inputs: string[] = ipRange.trim().split(/[\r\n,]+\s*/);
    //현재 로그인 한 아이디의 IP 대역을 계산한다.
    const cookieIPs: string[] = cookieRange.trim().split(/[\r\n,]+\s*/);

    // 각 입력에 대해 형식을 검사합니다.
    for (const input of inputs) {
        // Label을 지정해서 break문을 빠져나올 수 있음
        outer: {
        for (const cookieIP of cookieIPs) {
                comStartFlag = true;
                comEndFlag = true;

                // 입력값이 ip 일때
                if (ipRangeRegex.test(input)) {
                    const ipAddresses: string[] = input.split("-");
                    const startIP: string[] = ipAddresses[0].trim().split(".");
                    const endIP: string[] = ipAddresses[1].trim().split(".");
                    if(ipRangeRegex.test(cookieIP)){
                        //쿠키가 ip 일때
                        const cookieIpAddresses: string[] = cookieIP.split("-");
                        const cookieStartIP: string[] = cookieIpAddresses[0].trim().split(".");
                        const cookieEndIP: string[] = cookieIpAddresses[1].trim().split(".");

                        // 시작 IP 주소와 끝 IP 주소가 유효한지 확인합니다.
                        if (startIP.length !== 4 || endIP.length !== 4 || !isValidIPAddress(startIP) || !isValidIPAddress(endIP) || compareRange(startIP, endIP)) {
                            return false;
                        }

                        // 시작 IP 주소가 끝 IP 주소보다 작은지 확인합니다.
                        for (i = 0; i < 4; i++) {                            
                            // 아닌 경우
                            if ((comStartFlag && parseInt(startIP[i], 10) < parseInt(cookieStartIP[i], 10)) || (comEndFlag && parseInt(endIP[i], 10) > parseInt(cookieEndIP[i], 10))) {
                                // i가 3일 경우에 들어올 수 있으므로 구분짓기 위해 추가
                                i=-1;
                                break;
                            }
                            if(comStartFlag && parseInt(startIP[i], 10) > parseInt(cookieStartIP[i], 10)) {
                                comStartFlag = false;
                            }
                            if(comEndFlag && parseInt(endIP[i], 10) < parseInt(cookieEndIP[i], 10)) {
                                comEndFlag = false;
                            }
                            if(!comStartFlag && !comEndFlag) {
                                break outer;
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

                        // 시작 IP 주소와 끝 IP 주소가 유효한지 확인합니다.
                        if (startIP.length !== 4 || endIP.length !== 4 || !isValidIPAddress(startIP) || !isValidIPAddress(endIP) || compareRange(startIP, endIP)) {
                            return false;
                        }

                        // 시작 IP 주소가 끝 IP 주소보다 작은지 확인합니다.
                        for (i = 0; i < 4; i++) {
                            if ((comStartFlag && parseInt(startIP[i], 10) < startIpParts[i]) || (comEndFlag && parseInt(endIP[i], 10) > endIpParts[i])) {
                                break;
                            }
                            if(comStartFlag && parseInt(startIP[i], 10) > startIpParts[i]) {
                                comStartFlag = false;
                            }
                            if(comEndFlag && parseInt(endIP[i], 10) < endIpParts[i]) {
                                comEndFlag = false;
                            }
                            if(!comStartFlag && !comEndFlag) {
                                break outer;
                            }
                        }
                    }
                } 
                //입력값이 cidr일때
                else if (cidrRegex.test(input)) {
                    
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
                            return false;
                        } 
                        const cidrValue = parseInt(cidr, 10);
                        if (isNaN(cidrValue) || cidrValue < 0 || cidrValue > 32 ) {
                        // || cidrValue % 8 !== 0) {
                            return false;
                        }
                        for(i = 0; i< parts.length; i++){
                            if((comStartFlag && startIpParts[i] < cookieStartIP[i]) || (comEndFlag && endIpParts[i] > cookieEndIP[i])){
                                break;
                            }
                            if(comStartFlag && startIpParts[i] > cookieStartIP[i]) {
                                comStartFlag = false;
                            } 
                            if(comEndFlag && endIpParts[i] < cookieEndIP[i]) {
                                comEndFlag = false;
                            }
                            if(!comStartFlag && !comEndFlag) {
                                break outer;
                            }
                        }
                    } else if (ipRangeRegex.test(cookieIP)){
                        //쿠키가 그냥ip일때
                        const cookieIpAddresses: string[] = cookieIP.split("-");
                        const cookieStartIP: string[] = cookieIpAddresses[0].trim().split(".");
                        const cookieEndIP: string[] = cookieIpAddresses[1].trim().split(".");
                        if (parts.some(part => isNaN(part) || part < 0 || part > 255)) {
                            // IP 주소의 각 자리수가 0에서 255 사이의 값을 가져야 합니다.
                            return false;
                        } 
                        const cidrValue = parseInt(cidr, 10);
                        if (isNaN(cidrValue) || cidrValue < 0 || cidrValue > 32 ) {
                        // || cidrValue % 8 !== 0) {
                            // CIDR 접두사는 0에서 32 사이의 값을 가져야 하며, 8의 배수여야 합니다.
                            return false;
                        }
                        for(i = 0; i< parts.length; i++){
                            if((comStartFlag && startIpParts[i] < parseInt(cookieStartIP[i], 10)) || (comEndFlag && endIpParts[i] > parseInt(cookieEndIP[i], 10))){
                                break;
                            }
                            if(comStartFlag && startIpParts[i] > parseInt(cookieStartIP[i], 10)) {
                                comStartFlag = false;
                            } 
                            if(comEndFlag && endIpParts[i] < parseInt(cookieEndIP[i], 10)) {
                                comEndFlag = false;
                            }
                            if(!comStartFlag && !comEndFlag) {
                                break outer;
                            }
                        }
                    }
                } 
                // 입력값이 IP Range도 아니고 CIDR도 아닐 경우
                else {
                    return false;
                }

                //이번 입력 ip가 이번 쿠키에 아무 문제 없이 속할 경우 다음 ip에 대해 검사하자
                if(i === 4) {
                    break;
                } else if(cookieIP === cookieIPs[cookieIPs.length-1]) {
                    return false;
                }
            }
        } // outer
    }

    return true;
}