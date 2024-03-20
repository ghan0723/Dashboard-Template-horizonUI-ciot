import { Box, Flex, Icon, IconButton, Progress, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useColorModeValue } from '@chakra-ui/react';
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';
// Custom components
import Card from 'components/card/Card';
import IconBox from 'components/icons/IconBox';
import * as React from 'react';
import { IoMdInformation } from 'react-icons/io';
// Assets
import { RiFileExcel2Fill } from 'react-icons/ri';
import { TbLetterCSmall, TbLetterHSmall, TbLetterISmall, TbLetterLSmall, TbLetterMSmall } from 'react-icons/tb';
import { Paginate } from 'react-paginate-chakra-ui';
import { analysisAlias } from 'utils/alias';
import { getNameCookie } from 'utils/cookie';
import { backIP } from 'utils/ipDomain';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ScoringTable(props: {
	tableData: any, setDetail: any, detailSubmit: any, title: any,
	startDate: any, endDate: any, checkedKeywords: any, userNameCookie: any
}) {
	const { tableData, setDetail, detailSubmit, title, startDate, endDate, checkedKeywords, userNameCookie } = props;
	const [page, setPage] = React.useState(0);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	const rows: number = 11;
	let defaultData = tableData;
	let keys = tableData[0] !== undefined && Object.keys(tableData[0]);
	let i: number;
	let str: string = '';
	let columns = [];
	i = 0;
	// State로 컬럼 너비 관리
	const [columnWidths, setColumnWidths] = React.useState<{ [key: string]: number }>({
		status: 130,
		progress: 250,
		pcName: 200,
		text: 250,
	});

	while (true) {
		if (tableData[0] === undefined) break;
		if (i >= keys.length) break;
		str = keys.at(i);


		// Tables Data
		if (str === 'status') {
			columns.push(
				columnHelper.accessor(str, {
					id: str,
					header: () => {
						<Text
							justifyContent="space-between"
							align="center"
							fontSize={{ sm: '10px', lg: '12px' }}
							color="gray.400"
						>
							{str}
						</Text>
					},
					cell: (info: any) => {
						return (
							<Flex align='center'>
								<Icon
									w='24px'
									h='24px'
									me='5px'
									bgColor={
										info.row.original.level >= 5 ? (
											'#D32F2F'
										) : info.row.original.level >= 4 ? (
											'#E57373'
										) : info.row.original.level >= 3 ? (
											'#FFA000'
										) : info.row.original.level >= 2 ? (
											'green.400'
										) : info.row.original.level >= 1 ? (
											'blue.500'
										) : null
									}
									color={'white'}
									borderRadius={'50%'}
									as={
										info.row.original.level >= 5 ? (
											TbLetterCSmall
										) : info.row.original.level >= 4 ? (
											TbLetterHSmall
										) : info.row.original.level >= 3 ? (
											TbLetterMSmall
										) : info.row.original.level >= 2 ? (
											TbLetterLSmall
										) : info.row.original.level >= 1 ? (
											TbLetterISmall
										) : null
									}
								/>
								<Text color={textColor} fontSize='sm' fontWeight='700'>
									{info.getValue()}
								</Text>
							</Flex>
						);
					},
				}),
			);
		} else if (str === 'progress') {
			columns.push(
				columnHelper.accessor(str, {
					id: str,
					header: () => {
						<Text
							justifyContent="space-between"
							align="center"
							fontSize={{ sm: '10px', lg: '12px' }}
							color="gray.400"
						>
							{str}
						</Text>
					},
					cell: (info: any) => {
						return (
							<Flex align='center'>
								<Progress variant='table' colorScheme='brandScheme' h='8px' w='60px' value={info.getValue()} />
							</Flex>
						);
					},
				}),
			);
		} else if (str === 'text') {
			columns.push(
				columnHelper.accessor(str, {
					id: str,
					header: () => {
						<Text
							justifyContent="space-between"
							align="center"
							fontSize={{ sm: '10px', lg: '12px' }}
							color="gray.400"
						>
							{str}
						</Text>
					},
					cell: (info: any) => {
						const parts = info.getValue().split(", ");

						return (
							<Flex color={textColor} fontSize="sm" fontWeight="700"
							>
								{
									parts.map((part: any) => {
										const [label, value] = part.split(":");
										const labelAlias = label.includes('빈도')   ? 'O : ' :
														   label.includes('용량')   ? 'S : ' :
														   label.includes('키워드') ? 'K : ' : 
														   label.includes('패턴')   ? 'P : ' : '';

										return (
											<Flex key={part}>
												<Text>{labelAlias}</Text>
												<Text
													ml={'5px'}
													mr={'10px'}
													color={value === '관심' ? 'blue.500' :
														value === '주의' ? 'green.400' :
															value === '경계' ? '#FFA000' :
																value === '심각' ? '#E57373' :
																	'#D32F2F'}
												>
													{value}
												</Text>
											</Flex>
										);
									})
								}
							</Flex>
						);
					},
				}),
			);
		} else if (str !== 'pcGuid' && str !== 'level') {
			columns.push(
				columnHelper.accessor(str, {
					id: str,
					header: () => {
						<Text
							justifyContent="space-between"
							align="center"
							fontSize={{ sm: '10px', lg: '12px' }}
							color="gray.400"
						>
							{str}
						</Text>
					},
					cell: (info: any) => {
						return (
							<Tooltip label={info.getValue()}>
								<Text color={textColor} fontSize="sm" fontWeight="400"
									overflow="hidden"
									whiteSpace="nowrap"
									textOverflow="ellipsis"
									display="inline-block" // 또는 "block"
									maxWidth="100%" // 또는 적절한 최대 너비 설정
								>
									{info.getValue()}
								</Text>
							</Tooltip>
						);
					},
				}),
			);
		}

		i++;
	}
	

	const [data, setData] = React.useState(() => [...defaultData]);
	React.useEffect(() => {
		setData(tableData);
	}, [tableData]);

	let table = useReactTable({
		data,
		columns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		debugTable: true,
		enableColumnResizing: true,
		columnResizeMode: 'onChange',

	});

	// Paging
	const handlePageClick = (p: number) => {
		setPage(p);
	};

	const showDetail = (data: any) => {
		setDetail(true);
		detailSubmit(data?.pcGuid, data?.pcName, data?.level, data?.status);
	}

	// 액셀 데이터 저장
	const handleSaveExcel = async () => {
		try {
			const response = await fetch(`${backIP}/excel/analytics?username${userNameCookie}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					startDate: startDate,
					endDate: endDate,
					keywords: checkedKeywords
				})
			});

			if (response.ok) {
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);

				// a 태그를 만들어서 다운로드
				const a = document.createElement('a');
				a.href = url;
				a.download = `analytics.xlsx`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);

				// 브라우저에 생성된 URL 해제
				window.URL.revokeObjectURL(url);
			} else {
			}
		} catch (error) {
		}
	}

	// 마우스 드래그로 너비 조절 핸들러
	const handleColumnResize = (columnId: string, initialPosition: number) => {
		const startDrag = (e: MouseEvent) => {
			const delta = e.clientX - initialPosition;
			setColumnWidths(prevWidths => ({
				...prevWidths,
				[columnId]: Math.max(prevWidths[columnId] + delta, 100) // 최소 너비를 100으로 설정
			}));
			initialPosition = e.clientX;
		};

		const stopDrag = () => {
			document.removeEventListener('mousemove', startDrag);
			document.removeEventListener('mouseup', stopDrag);
		};

		document.addEventListener('mousemove', startDrag);
		document.addEventListener('mouseup', stopDrag);
	};

	// 컬럼 헤더에 마우스 다운 이벤트 추가 (예시)
	const headerProps = (columnId: string) => ({
		onMouseDown: (e: React.MouseEvent) => {
			handleColumnResize(columnId, e.clientX);
		},
	});

	return (
		<Card flexDirection='column' w={{ base: '50%', md: '100%', sm: '100%', xl: '50%' }} h={'100%'} px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}  >
			<Flex px='25px' mb="8px" justifyContent={'space-between'} align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					({title === '7d' ? '1주일' : (title.includes('m') ? title.at(0) + '개월' : '1년')}치) 네트워크 유출에 대한 위험점수 순위
				</Text>
				<Tooltip label={
					<Box>
						<Text>※ (Scoring 근거) 위험 요소별 Max 수치</Text>
						<Text>① 키워드 표현식 : 존재유무</Text>
						<Text>② 패턴 표현식 : Max 1,000건</Text>
						<Text>③ 유출 용량 : (주)Max 100MB, (월)Max 200MB</Text>
						<Text>④ 유출 빈도 : (주)Max 50건, (월)Max 100건</Text>
					</Box>
				} placement={'right-end'}>
					<Box>
						<Icon boxSize={'20px'} as={IoMdInformation} bgColor={'#c0c0c0'} borderRadius={'50%'} color={'white'} borderColor={'white'} />
					</Box>
				</Tooltip>
			</Flex>
			<Flex justifyContent={'space-between'}>
				<Flex ml={'10px'}>
					{/* 매우 심각 Critical */}
					<Flex mr={'2%'} >
						<IconBox
							w="40px"
							h="40px"
							icon={
								<Icon boxSize={'24px'} as={TbLetterCSmall} bgColor={'#D32F2F'} borderRadius={'50%'} color={'white'} borderColor={'white'} />
							}
						/>
						<Text w={'80px'} lineHeight={'40px'}> 매우 심각</Text>
					</Flex>
					{/* 심각 high */}
					<Flex mr={'2%'}>
						<IconBox
							w="40px"
							h="40px"
							icon={
								<Icon boxSize={'24px'} as={TbLetterHSmall} bgColor={'#E57373'} borderRadius={'50%'} color={'white'} borderColor={'white'} />
							}
						/>
						<Text w={'80px'} lineHeight={'40px'}> 심각</Text>
					</Flex>
					{/* 경고 Medium */}
					<Flex mr={'2%'}>
						<IconBox
							w="40px"
							h="40px"
							icon={
								<Icon boxSize={'24px'} as={TbLetterMSmall} bgColor={'#FFA000'} borderRadius={'50%'} color={'white'} borderColor={'white'} />
							}
						/>
						<Text w={'80px'} lineHeight={'40px'}> 경계</Text>
					</Flex>
					{/* 주의 Low */}
					<Flex mr={'2%'}>
						<IconBox
							w="40px"
							h="40px"
							icon={
								<Icon boxSize={'24px'} as={TbLetterLSmall} bgColor={'green.400'} borderRadius={'50%'} color={'white'} borderColor={'white'} />
							}
						/>
						<Text w={'80px'} lineHeight={'40px'}> 주의</Text>
					</Flex>
					{/* 안전 Safe */}
					<Flex mr={'2%'}>
						<IconBox
							w="40px"
							h="40px"
							icon={
								<Icon boxSize={'24px'} as={TbLetterISmall} bgColor={'blue.500'} borderRadius={'50%'} color={'white'} borderColor={'white'} />
							}
						/>
						<Text w={'80px'} lineHeight={'40px'}> 관심</Text>
					</Flex>
				</Flex>
				<Box mr={'3%'}>
					<IconButton
						w={'40px'} h={'40px'}
						aria-label="Save Excel"
						icon={
							<Icon boxSize={'24px'} as={RiFileExcel2Fill} />
						}
						onClick={handleSaveExcel}
					/>
				</Box>
			</Flex>
			<Box h={'90%'} overflowY={'hidden'}>
				<Table variant='simple' color='gray.500' overflowY={'hidden'} borderTop={'2px solid black'} w={'97%'} m={'12px auto 10px'}>
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									let headerText = analysisAlias[header.id];
									return (
										<Th
											width={columnWidths[header.id]}
											key={header.id}
											colSpan={header.colSpan}
											pl={header.id === 'status' ? '10px' : ''}
											pr='10px'
											border={'1px solid #ccc'}
											backgroundColor={'#F0F0F0'}
											cursor='pointer'
											position={'relative'}
										>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '12px', lg: '14px' }}
												color='black'
												fontWeight={'bold'}>
												<Box
													w={'85%'}
													textAlign={'center'}
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(headerText, header.getContext())}
												</Box>
												{{
													asc: '',
													desc: '',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
											{header.column.getCanResize() && (
												<Box
													{...headerProps(header.id)}
													className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''
														}`}
												></Box>
											)}
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody >
						{table.getRowModel().rows.map((row) => {
							if (row.index >= rows * page && row.index < rows * (page + 1)) {
								return (
									<Tr key={row.id}
										_hover={{ backgroundColor: '#F2F7FF' }}>
										{row.getVisibleCells().map((cell) => {
											return (
												<Td
													key={cell.id}
													fontSize={{ sm: '14px' }}
													minW={{ sm: '150px', md: '200px', lg: 'auto' }}
													border={'1px solid #ccc'}
													cursor={'pointer'}
													pt={'5px'} pb={'5px'}
													pl={cell.column.id === 'pcName' ? '20px' : '10px'}
													pr={cell.column.id === 'pcName' ? '15px' : '10px'}
													width={'100px'}
													maxWidth={'100px'}
													whiteSpace="nowrap"
													overflow='hidden'
													textOverflow='ellipsis'
													onClick={() => showDetail(row?.original)}
												>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</Td>
											);
										})}
									</Tr>
								);
							}
						})}
					</Tbody>
				</Table>
				<Flex w={'100%'} justifyContent={'end'}>
					<Text mr={'2%'}>
						O : 유출 빈도, S : 유출 용량, K : 키워드, P : 패턴
					</Text>
				</Flex>
			</Box>
			<Flex justifyContent="center">
				<Paginate
					page={page}
					margin={3}
					shadow="lg"
					fontWeight="bold"
					variant="outline"
					colorScheme="blue"
					border="2px solid"
					count={defaultData.length}
					pageSize={rows}
					onPageChange={handlePageClick}
				></Paginate>
			</Flex>
		</Card>
	);
}
