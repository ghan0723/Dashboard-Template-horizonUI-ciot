import { Box, Flex, Icon, Progress, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
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
import Menu from 'components/menu/MainMenu';
import * as React from 'react';
// Assets
import { MdCancel, MdCheckCircle, MdOutlineError } from 'react-icons/md';
import { analysisAlias } from 'utils/alias';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ScoringTable(props: { tableData: any }) {
	const { tableData } = props;
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	let defaultData = tableData;
	let keys = tableData[0] !== undefined && Object.keys(tableData[0]);
	let i: number;
	let str: string = '';
	let columns = [];
	i = 0;
	while (true) {
		if (tableData[0] === undefined) break;
		if (i >= keys.length) break;
		str = keys.at(i - 1);
		if (str === 'username') {
			// str = "사용자명";
		}
		// Tables Data
		if (str === 'sum') {
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
									color={
										info.getValue() >= 100 ? (
											'red.500'
										) : info.getValue() >= 50 ? (
											'orange.500'
										) : info.getValue() >= 0 ? (
											'green.500'
										) : null
									}
									as={
										info.getValue() >= 100 ? (
											MdCancel
										) : info.getValue() >= 50 ? (
											MdOutlineError
										) : info.getValue() >= 0 ? (
											MdCheckCircle
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
								<Progress variant='table' colorScheme='brandScheme' h='8px' w='108px' value={info.getValue()} />
							</Flex>
						);
					},
				}),
			);
		} else {
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
							<Text color={textColor} fontSize="sm" fontWeight="700"
							>
								{info.getValue()}
							</Text>
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
		debugTable: true
	});
	return (
		<Card flexDirection='column' w='50%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					1주일 중 최대 위험도 평가
				</Text>
			</Flex>
			<Box>
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									let headerText = analysisAlias[header.id];
									return (
										<Th
											key={header.id}
											colSpan={header.colSpan}
											pe='10px'
											borderColor={borderColor}
											cursor='pointer'
											onClick={header.column.getToggleSortingHandler()}>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '10px', lg: '12px' }}
												color='gray.400'>
												{flexRender(headerText, header.getContext())}
												{{
													asc: '',
													desc: '',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.map((row) => {
							return (
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												fontSize={{ sm: '14px' }}
												minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												borderColor='transparent'
												cursor={'pointer'}
												>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</Card>
	);
}
