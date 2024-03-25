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
