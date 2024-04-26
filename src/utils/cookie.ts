import { redirect } from 'next/navigation';
import { backIP, frontIP } from './ipDomain';
import Swal from 'sweetalert2';

export const getCookie = (cookieName: string) => {  
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 document 객체가 없으므로 여기서 처리를 중단
    return null;
  }
  const cookie = document.cookie;
  const useCookie = cookie
    .split(';')
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith(`${cookieName}=`));

  if (useCookie) {
    const cookieValue = useCookie.split('=')[1];
    return cookieValue;
  }
};

export const deleteCookie = (cookieName: string) => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 document 객체가 없으므로 여기서 처리를 중단
    return;
  }
  // 현재 시간 이전으로 설정하여 쿠키를 만료시킴
  const pastDate = new Date(0);
  // secure 옵션 제외
  document.cookie = `${cookieName}=; expires=${pastDate.toUTCString()}; path=/;`;
};

export const getNameCookie = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${backIP}/user/namecookie`, {
      credentials: 'include',
    });
    
    const data = await response.json();
    // 쿠키 시간이 만료 되었을 때
    if (data.username === undefined || data.username === null) {
      Swal.fire({
        title: '쿠키 만료',
        html: `<div style="font-size: 14px;">세션이 만료되어 로그아웃 됩니다.</div>`,
        confirmButtonText: '닫기',
        confirmButtonColor: '#EE5D50',
        focusConfirm: false,
        customClass: {
          popup: 'custom-popup-class',
          title: 'custom-title-class',
          loader: 'custom-content-class',
          confirmButton: 'custom-confirm-button-class'
        },
      })
      .then((response) => {
        if(response.isConfirmed) {
          window.location.href = `${frontIP}/auth/sign-in`;
        }
      });
            
      return null;
    } else {
      return data.username;
    }
  } catch (error) {
    return null; // 또는 기본값으로 적절한 값을 반환
  }
};

