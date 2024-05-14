import { Flex, Box, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, Select, Button, Link, Input, IconButton, color } from '@chakra-ui/react';
import * as React from 'react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import { Paginate } from 'react-paginate-chakra-ui';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { getNameCookie } from 'utils/cookie';
import { backIP } from 'utils/ipDomain';
import { userAlias } from 'utils/alias';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function CheckTable(
  props: {
    tableData: any; name: any; setTableData: any
    category: any, setCategory: any, searchWord: any, setSearchWord: any
    searchButton: any, setSearchButton: any, rows: any, setRows: any, page: any, setPage: any, fetchPrivilegeAndData: any
  },
  { children }: { children: React.ReactNode },
) {
  const { tableData, name, setTableData, category, setCategory,
    searchWord, setSearchWord, searchButton, setSearchButton, rows, setRows, page, setPage, fetchPrivilegeAndData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [checkedRows, setCheckedRows] = React.useState<{ [key: string]: boolean }>({});
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  let defaultData = tableData;
  let keys = tableData[0] !== undefined && Object.keys(tableData[0]);
  let i: number;
  let str: string = '';
  let columns = [];
  i = 0;

  const [columnWidths, setColumnWidths] = React.useState<{ [key: string]: number }>({
		check: 50,
		username: 250,
		privilege: 150,
		enabled: 150,
    ip_ranges: 500,
	});

  while (true) {
    if (tableData[0] === undefined) break;
    if (i >= keys.length + 1) break;
    str = keys.at(i - 1);
    if (str === 'username') {
      // str = "사용자명";
    }
    // CheckBox
    if (i === 0) {
      columns.push(
        columnHelper.accessor('check', {
          id: 'check',
          header: () => (
            <></>
          ),
          cell: (info: any) => (
            <Flex align="center" justifyContent="center">
              <Checkbox
                justifyContent="center"
                isChecked={checkedRows[info.row.original.username] || false}
                colorScheme="brandScheme"
                // me="10px"
                w={'20px'}
                margin={'0'}
                padding={'0'}
                onChange={() => handleCheckboxToggle(info.row.original.username)}
              />
            </Flex>
          ),
        }),
      );
    } else {
      // Tables Data
      columns.push(
        columnHelper.accessor(str, {
          id: str,
          header: () => {
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: '10px', lg: '12px' }}
              color="gray.400"
              textAlign={'center'}
            >
              {str === "ip_ranges" ? '사용자명' : str}
            </Text>
          },
          cell: (info: any) => {
            return (
              <Text color={textColor} fontSize="sm" fontWeight="400"
              >
                {(info.column.id === 'privilege') ? (
                  (info.getValue() !== 1) ? (info.getValue() !== 2 ? (info.getValue() !==3 ? '' : '모니터') : '영역별 관리자') : '관리자'
                ) : ((info.column.id === 'enabled') ? (info.getValue() === 1 ? "활성화" : (info.getValue() === 0 ? "비활성화" : "")) : info.getValue())}
              </Text>
            );
          },
        }),
      );
    }

    i++;
  }

  // 체크박스를 토글하는 핸들러
  // handleCheckboxToggle 함수 수정
  const handleCheckboxToggle = (rowId: string) => {
    setCheckedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const handleDeleteSelectedRows = () => {
    const selectedRows = Object.keys(checkedRows).filter((rowId) => checkedRows[rowId]);
    removeUser(selectedRows);
  };

  const removeUser = async (selectedRows: string[]) => {
    try {
      const username = await getNameCookie();
      const response = await fetch(`${backIP}/user/rm?username=${username}&category=${category}&searchWord=${searchWord}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedRows)
      });
      const result = await response.json();
      setTableData(result);
      fetchPrivilegeAndData();
      setCheckedRows({});
    } catch (error) {
    }
  }

  const [data, setData] = React.useState(() => [...defaultData]);
  // const [rows, setRows] = React.useState(10);

  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  React.useEffect(() => {
    setPage(0);
  }, [name]);

  let table = useReactTable({
    data,
    columns,
    state: {
      sorting,
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
  // handlers
  const handleRows = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRows = parseInt(e.target.value, 10); // Assuming you want to parse the value as an integer
    setRows(newRows);
  };

  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  }

  const handleSearchWord = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  }

  const handleSearchWordKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      setSearchButton(!searchButton);
    }
  };

  const handleSearcchButton = () => {
    setSearchButton(!searchButton);
  };

  const handleToggleSelectAll: React.MouseEventHandler<HTMLTableHeaderCellElement> = () => {
    const allChecked = Object.values(checkedRows).every((isChecked) => isChecked);
    const selectAll = !allChecked;

    const updatedCheckedRows: { [key: string]: boolean } = {};
    tableData.forEach((row: any) => {
      updatedCheckedRows[row.username] = selectAll;
    });

    setCheckedRows(updatedCheckedRows);
  };

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
    <Card
      flexDirection="column"
      px="0px"
      overflowX={'hidden'}
      m='0 auto'
      height='100vh'
      borderRadius={'0px'}
    >
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          mb="4px"
          fontWeight="700"
          lineHeight="100%"
        >
          {name}
        </Text>
        <Flex>
          <Link href='/users/new'
            mr={'5px'}>
            <Button as="a"><AddIcon></AddIcon></Button>
          </Link>
          <Button
            onClick={handleDeleteSelectedRows}
          ><DeleteIcon></DeleteIcon></Button>
          <Select
            fontSize="sm"
            value={rows}
            onChange={handleRows}
            fontWeight="700"
          >
            <option value="10">10개</option>
            <option value="20">20개</option>
            <option value="50">50개</option>
          </Select>
          <Select
            fontSize="sm"
            variant="subtle"
            value={category}
            onChange={handleCategory}
            fontWeight="700"
          >
            {
              tableData[0] !== undefined && keys.map((data) => {
                let optionValue = userAlias[data];
                return (
                  <option value={data} key={data}>{optionValue}</option>
                )
              })
            }
          </Select>
          <Input placeholder='검색' id='searchText' name='searchText'
            value={searchWord}
            onChange={handleSearchWord}
            onKeyDown={handleSearchWordKeyDown}
          />
          <IconButton aria-label='Search database' icon={<SearchIcon />}
            onClick={handleSearcchButton}
          />
        </Flex>
      </Flex>
      <Box w={'100%'}>
        <Table variant="simple" color="gray.500" w={'95%'} borderTop={'2px solid black'} margin={'12px auto 24px'}
        >
          <Thead w={'100%'}>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  let headerText = userAlias[header.id]; 
                  return (
                    <Th
                      width={columnWidths[header.id]}
                      key={header.id}
                      colSpan={header.colSpan}
                      cursor="pointer"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      border={'1px solid #ccc'}
                      backgroundColor={'#F0F0F0'}
                      textAlign={'center'}
                      position={'relative'}
                      // paddingLeft={header.id === 'check' ? '0px' : '24px'}
                      // paddingRight={header.id === 'check' ? '0px' : '24px'}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: '12px', lg: '15px' }}
                        color="black"
                        fontWeight={'bold'}
                      >
                        <Box 
                        textAlign={'center'}
                        onClick={(header.id !== 'check') ? header.column.getToggleSortingHandler() : handleToggleSelectAll} w={'95%'}
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
          <Tbody>
            {
              table
                .getRowModel()
                .rows.slice(page * rows, (page + 1) * rows)
                .map((row) => {
                  return (
                    <Tr key={row.id}
                      _hover={{ backgroundColor: '#F2F7FF' }}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td
                            key={cell.id}
                            fontSize={{ sm: '14px' }}
                            minW={'auto'}
                            border={'1px solid #ccc'}
                            cursor='pointer'
                            textAlign={cell.id.includes('ip_ranges') ? 'start' : 'center'}
                            onClick={() => {
                              if (cell.id.includes('username')) {
                                window.location.href = `/users/modify?name=${cell.getValue()}`;
                              }
                            }}
                            p={'10px'}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
          </Tbody>
        </Table>
        <Flex justifyContent="center">
          <Paginate
            page={page}
            margin={3}
            shadow="lg"
            fontWeight="bold"
            variant="outline"
            colorScheme="blue"
            // ...border and other props also work 💪
            border="2px solid"
            // you can use w to adjust to parent
            // container
            // w={'50%'}
            count={table.getRowModel().rows.length}
            pageSize={rows}
            onPageChange={handlePageClick}
          ></Paginate>
        </Flex>
      </Box>
    </Card>
  );
}