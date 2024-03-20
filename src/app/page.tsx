import { redirect } from 'next/navigation';
import { getCookie } from 'utils/cookie';
export default function Home({}) {
  const username = getCookie('username');
  if(username !== undefined && username !== null){
    redirect('/dashboard/default');
  }else{ 
    redirect('/auth/sign-in');
  }
}
