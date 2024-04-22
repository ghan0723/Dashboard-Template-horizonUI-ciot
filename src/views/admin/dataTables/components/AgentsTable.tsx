import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Select,
  IconButton,
  Input,
  Tooltip,
  Stack,
  Button,
} from '@chakra-ui/react';
import * as React from 'react';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import { Paginate } from 'react-paginate-chakra-ui';
import { EditIcon, SearchIcon } from '@chakra-ui/icons';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { getNameCookie } from 'utils/cookie';
import { backIP, frontIP } from 'utils/ipDomain';
import { RiFileExcel2Fill, RiScreenshot2Fill } from 'react-icons/ri';
import { agentInfoAlias } from 'utils/alias';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function AgentsTable(
  props: {
    tableData: any; setTableData: any; rows: any; setRows: any; page: any; setPage: any; sorting: any; setSorting: any; search: any;
    searchResult: any; setSearchResult: any; searchComfirm: boolean; setSearchComfirm: any;
  },
  { children }: { children: React.ReactNode },
) {
  const { tableData, setTableData, rows, setRows, page, setPage, sorting, setSorting, search, searchResult, setSearchResult, searchComfirm, setSearchComfirm } = props;
  const [data, setData] = React.useState(() => {
    return tableData !== undefined && tableData;
  });
  const [categoryFlag, setCategoryFlag] = React.useState<boolean>(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  const query = React.useRef('page=' + page + '&pageSize=' + rows + '&sorting=' + (sorting[0]?.id ?? '') + '&desc=' + (sorting[0]?.desc ?? '') + '&category=' + search.current + '&search=' + searchResult);
  const keys = React.useRef(
    tableData[0] !== undefined &&
    tableData[0] !== null &&
    tableData[0].length !== 0 ?
    Object.keys(tableData[0][0]) : undefined);    

  // useState => ui 화면에서 render가 잘 되게 하기위해 사용
  // search => useRef를 이용하여 변경 값을 바로 적용하게끔 사용
  const [searchValue, setSearchValue] = React.useState(search.current); // 렌더링 될 때 값이 바로 변경할 수 있도록 설정

  const [columnWidths, setColumnWidths] = React.useState<{ [key: string]: {name:string, align:string, width:number} }>(agentInfoAlias);

  function formatDate(date: any): string {
    // date가 문자열인 경우에 대한 보완도 추가
    const parsedDate = typeof date === 'string' && date !== undefined ? new Date(date) : date;

    // 로컬 시간대로 형식화
    const localDateString = parsedDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' });

    // 다시 Date 객체로 변환
    const localDate = new Date(localDateString);

    // 8시간을 더해주기
    localDate.setHours(localDate.getHours() + 9);

    const isoString = (localDate instanceof Date && !isNaN(localDate.getTime())) ? localDate.toISOString() : '';

    // ISO 문자열 변환
    const formattedDate = isoString
      .replace(/-/g, '/') // '-'를 '/'로 변경
      .replace('T', ' ') // 'T'를 공백으로 변경
      .replace(/\..*/, ''); // 소수점 이하 시간 제거
    
    
    // ISO 문자열로 반환
    return formattedDate;
  }

  let i: number;
  let str: string = '';
  let columns = [];

  // TanStack Table
  // columns table Create
  i = 0;
  while (true) {
    if (tableData[0] === undefined) break;
    if (keys.current === undefined) break;
    if (i >= keys.current.length) break;
    str = keys.current.at(i);

    // Tables Data
    columns.push(
      columnHelper.accessor(str, {
        id: str,
        header: () => {
          return <></>;
        },
        cell: (info: any) => {
          return (
                <Tooltip label={info.getValue() !== undefined && info.getValue() !== null && 
                                ((info.column.id === 'Time') ? formatDate(info.getValue()) : info.getValue()
                              )}>
                  <Text
                    color={textColor}
                    // fontSize="s"
                    fontSize="13px"
                    fontWeight="400"
                    maxWidth="100%" // 또는 적절한 최대 너비 설정
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    display="inline-block" // 또는 "block"
                  >
                    {info.getValue() !== undefined &&
                      info.getValue() !== null &&
                      ((info.column.id === 'Time') ? formatDate(info.getValue()) : info.getValue())
                    }
                  </Text>
                </Tooltip>
          );
        },
      }),
    );

    i++;
  }

  React.useEffect(() => {
    setData(tableData[0]);

    if(tableData[0] !== undefined && tableData[0] !== null && tableData[0].length !== 0) {      
      keys.current = Object.keys(tableData[0][0]);      

      if (categoryFlag === false) {
        search.current = keys.current[0];
        setSearchValue(search.current);
        setCategoryFlag(true);
      }
    }
  }, [tableData]);

  // page 렌더링
  React.useEffect(() => {
    getNameCookie().then((username) => {
      query.current = 'page=' + page + '&pageSize=' + rows + '&sorting=' + (sorting[0]?.id ?? '') + '&desc=' + (sorting[0]?.desc ?? '') + '&category=' + search.current + '&search=' + searchResult + '&username=' + username;
    });
  }, [page]);

  // 나머지 항목 렌더링
  React.useEffect(() => {
    setPage(0);
    getNameCookie().then((username) => {
      query.current = 'page=' + page + '&pageSize=' + rows + '&sorting=' + (sorting[0]?.id ?? '') + '&desc=' + (sorting[0]?.desc ?? '') + '&category=' + search.current + '&search=' + searchResult + '&username=' + username;
    });
  }, [rows, search, searchResult]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    enableColumnResizing:true,
		columnResizeMode:'onChange',
  });

  // Paging
  const handlePageClick = (p: number) => {
    setPage(p);
  };

  // handlers
  // 갯수
  const handleRows = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRows = parseInt(e.target.value, 10); // Assuming you want to parse the value as an integer
    setRows(newRows);
  };

  // 검색 카테고리
  const handleSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    search.current = e.target.value;
    setSearchValue(search.current);
  };

  // 검색어 변경
  const handleSearchResult = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
  };

  // 검색어에서 Enter Key
  const handleSearchResultKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      setSearchComfirm(!searchComfirm);
    }
  };

  // 검색
  const handleSearchComfirm = () => {
    setSearchComfirm(!searchComfirm);
  };

	// 마우스 드래그로 너비 조절 핸들러
	const handleColumnResize = (columnId: string, initialPosition: number) => {
		const startDrag = (e: MouseEvent) => {
			const delta = e.clientX - initialPosition;
      setColumnWidths(prevWidths => ({
        ...prevWidths,
        [columnId]: {
          ...prevWidths[columnId],
          width : Math.max(prevWidths[columnId].width + delta, 30) // 최소 너비를 50으로 설정
        }
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

  // fetch
  // 더미 데이터 생성
  // 추후 hidden(Test용으로 dummy data를 만들기 때문에)
  const handleInsertData = async () => {
    const dummyDataCount = 30; // dummyData 만들기 위한 count
    try {
      const response = await fetch(`${backIP}/api/dummy?` + query.current + "&contents=leaked&count=" + dummyDataCount);

      const result = await response.json();
      setTableData(result);

    } catch (error) {
    }
  }
  // 액셀 데이터 저장
  const handleSaveExcel = async () => {    
    try {
      const response = await fetch(`${backIP}/excel/dwn?` + query.current + '&contents=leaked');

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // a 태그를 만들어서 다운로드
        const a = document.createElement('a');
        a.href = url;
        a.download = `leaked.xlsx`;
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

  const handleCopyText = (id:string,value:any) => {
    navigator.clipboard.writeText(value[id]).then(() => {
    }).catch(error => {
    });
  }

  // html
  if (data === undefined || data === null || keys.current === undefined) {
    return (
      <Stack direction="row" spacing={4} align="center">
        <Button
          isLoading
          loadingText="Loading"
          colorScheme="teal"
          variant="outline"
          spinnerPlacement="start"
        >
          Submit
        </Button>
      </Stack>
    );
  } else {
    return (
      <Card
        flexDirection="column"
        // w={{ lg : "30%", base : '100%'}}
        w='100%'
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'scroll' }}
        height='90vh'
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
            {/* {chname} */}
          </Text>
          <Box>
            <Flex>
              <IconButton
                aria-label="Save Excel"
                icon={<RiFileExcel2Fill></RiFileExcel2Fill>}
                onClick={handleSaveExcel}
              />
              {/* <IconButton
                aria-label="Edit database"
                icon={<EditIcon />}
                onClick={handleInsertData}
              /> */}
              <Select
                fontSize="sm"
                variant="subtle"
                value={rows}
                onChange={handleRows}
                width="unset"
                fontWeight="700"
              >
                <option value="20">20개</option>
                <option value="50">50개</option>
                <option value="100">100개</option>
              </Select>
              <Select
                fontSize="sm"
                variant="subtle"
                value={searchValue}
                onChange={handleSearch}
                width="unset"
                fontWeight="700"
              >
                {
                  
                (tableData[0] !== undefined && tableData[0] !== null && tableData[0].length !== 0) ?
                  keys.current.map((data) => {
                    
                      const dataStr = agentInfoAlias[data]?.name;
                      return (
                        <option value={data} key={data}>
                          {dataStr}
                        </option>
                      );
                  }) :
                  <></>
                }
              </Select>
              <Input
                placeholder="검색"
                id="searchText"
                name="searchText"
                value={searchResult}
                onChange={handleSearchResult}
                onKeyDown={handleSearchResultKeyDown}
              />
              <IconButton
                aria-label="Search database"
                icon={<SearchIcon />}
                onClick={handleSearchComfirm}
              />
            </Flex>
          </Box>
        </Flex>
        <Flex
          flexDirection="column" // 수직 중앙 정렬
          alignItems="center" // 수평 가운데 정렬
          justifyContent="center" // 수평 가운데 정렬
        >
          <Box 
          width='100%'
             >
            <Table
              variant="simple"
              color="gray.500"
              id="checkTable"
              w={'95%'}
              m={'12px auto 24px'}
              borderTop={'2px solid black'}
            >
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => {
                      let headerText = agentInfoAlias[header.id].name;
                      return (
                        <Th
                          width={columnWidths[header.id].width}
                          key={header.id}
                          colSpan={header.colSpan}
                          border={'1px solid #ccc'}
                          backgroundColor={'#F0F0F0'}
                          cursor="pointer"
                          whiteSpace="nowrap"
                          overflow='hidden'
                          textOverflow='ellipsis'
                          pt='5px' pb='5px'
                          pl='10px' pr='10px'
                          paddingInlineEnd='0px'
                          position={'relative'}
                        >
                            <Flex
                              justifyContent="center"
                              align="center"
                              fontSize={{ sm: '12px', lg: '14px' }}
                              color="black"
                              fontWeight={'bold'}
                            >
                              <Box
                              textAlign={'center'}
                              onClick={header.column.getToggleSortingHandler()} w={'85%'}
                              >
                                {flexRender(headerText, header.getContext())}
                              </Box>
                              {{
                                asc: <FaSortUp />,
                                desc: <FaSortDown />,
                                }[header.column.getIsSorted() as string] ?? null}
                            </Flex>
                            {header.column.getCanResize() && (
                                <Box
                                  {...headerProps(header.id)}
                                  className={`resizer ${
                                    header.column.getIsResizing() ? 'isResizing' : ''
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
                {table !== undefined &&
                  table.getRowModel()
                    .rows.slice(0, rows)
                    .map((row) => {                      
                      return (
                        <Tr key={row.id} borderBottom={'2px solid #f0f0f0'} 
                        _hover={{ backgroundColor: '#F2F7FF' }}>
                          {row.getVisibleCells().map((cell) => {       
                            return (
                              <Td
                                textAlign={ agentInfoAlias[cell.getContext().column.id]?.align }
                                key={cell.id}
                                fontSize={{ sm: '14px' }}
                                border={'1px solid #ccc'}
                                whiteSpace="nowrap"
                                overflow='hidden'
                                textOverflow='ellipsis'
                                // pt='5px' pb='5px'
                                p='2px'
                                cursor={'pointer'}
                                onClick={() => handleCopyText(cell.column.id,cell.row.original)}
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
                border="2px solid"
                count={tableData[1] !== undefined ? tableData[1][0].count : '1'}
                pageSize={rows}
                onPageChange={handlePageClick}
              ></Paginate>
            </Flex>
          </Box>
        </Flex>
      </Card>
    );
  }
}
