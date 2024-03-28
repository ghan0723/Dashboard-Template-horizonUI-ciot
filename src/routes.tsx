import { AtSignIcon, EmailIcon, RepeatIcon, StarIcon } from '@chakra-ui/icons';
import { Icon } from '@chakra-ui/react';
import { IoMdAnalytics } from 'react-icons/io';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdCarCrash,
  MdPerson3,
  MdOutlinePerson3,
  MdPeople,
  MdModeEdit,
  MdSettings,
  MdFileCopy,
  MdAnalytics,
} from 'react-icons/md';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: 'Dashboard',
    layout: '/dashboard',
    path: '/default',
    icon: <Icon as={AtSignIcon} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '유출탐지내역',
    layout: '/data',
    path: '',
    secondary: true,
    secondaryLinks: [
      {
        name: '유출탐지내역',
        path: '/tables'
      },
      {
        name: '관리대상 목록',
        path: '/leaked'
      }
    ],
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '분석',
    layout: '/analytics',
    path: '/main',
    icon: <Icon as={IoMdAnalytics} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '사용자 관리',
    layout: '/users',
    path: '',
    secondary: true,
    secondaryLinks: [
      {
        name: '사용자 관리',
        path: '/control'
      },
      {
        name: '본인정보수정',
        path: '/edit'
      }
    ],
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '로그인',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '설정',
    layout: '/setting',
    path: '',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="inherit" />,
    secondary: true,
    secondaryLinks: [{
      name: '서버',
      path: '/server',
    },
    {
      name: '에이전트',
      path: '/agent',
    }
    ],
  },
  {
    name: '로그',
    layout: '/log',
    path: '',
    icon: <Icon as={MdFileCopy} width="20px" height="20px" color="inherit" />,
    secondary: true,
    secondaryLinks: [{
      name: '감사 로그',
      path: '/config'
    },
    {
      name: '에러 로그',
      path: '/error',
    }
    ]
  },
  {
    name: '로그아웃',
    layout: '/profile',
    path: '/logout',
    icon: <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '비밀번호 변경',
    layout: '/pwd',
    path: '/freq',
    icon: <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />,
  },
  {
    name: '팝업창',
    layout: '/notice',
    path: '/popup',
  }
];

export default routes;
