import { backIP } from "./ipDomain";

export const fetchLogic = async (url: string, data?: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const response = await fetch(`${backIP}/` + url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const result = await response.json();
      data(result);
    } catch (error) {
    }
  }

export const fetchPost = async (url: string, body?: any) => {
    try {
      const response = await fetch(`${backIP}/` + url, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        body:JSON.stringify(body)
      });
      const result = await response.json();
      // 전달된 useState 함수를 사용하여 상태를 업데이트
      //data(result);
    } catch (error) {
    }
  }