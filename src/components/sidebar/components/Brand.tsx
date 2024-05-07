// Chakra imports
import { Flex, Img, Link, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
import { frontIP } from 'utils/ipDomain';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	const brandClick = (e:React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		const savedIndex = sessionStorage.getItem('sidebarIndex');
  
		if (savedIndex) {
			sessionStorage .setItem('sidebarIndex', '');
		}

		window.location.href = `${frontIP}/dashboard/default`;
	}

	return (
		<Flex alignItems='center' flexDirection='column'>
			{/* <HorizonLogo h='175px' w='175px' my='32px' color={logoColor} /> */}
			{/* <HSeparator mb='20px' />/ */}
			<Link
			href={`${frontIP}/dashboard/default`}
			w='190px' h='170px' 
			m={'0 55% 0 45%'}
			onClick = {brandClick}
			>
				<Img alt='위즐 로고임' src='/img/dashboards/Weasel_logo22.png'
				// w='190px' h='230px' 
				// m={'0 55% 0 45%'}
				></Img>
			</Link>
		</Flex>
	);
}

export default SidebarBrand;
