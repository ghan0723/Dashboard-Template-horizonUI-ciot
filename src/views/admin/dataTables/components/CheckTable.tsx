import {
  Flex,
  Box,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Select,
  ButtonProps,
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
  SortingState,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { Paginate } from 'react-paginate-chakra-ui';
import { SearchIcon } from '@chakra-ui/icons';
import { FaSortDown, FaSortUp } from 'react-icons/fa';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function CheckTable(
  props: {
    tableData: any;
    name: any;
    rows: any;
    setRows: any;
    page: any;
    setPage: any;
    sorting: any;
    setSorting: any;
    search: any;
    setSearch: any;
    searchResult: any;
    setSearchResult: any;
    searchComfirm: boolean;
    setSearchComfirm: any;
  },
  { children }: { children: React.ReactNode },
) {
  const {
    tableData,
    name,
    rows,
    setRows,
    page,
    setPage,
    sorting,
    setSorting,
    search,
    setSearch,
    searchResult,
    setSearchResult,
    searchComfirm,
    setSearchComfirm,
  } = props;
  const [data, setData] = React.useState(() => {
    return tableData[0] !== undefined && tableData[0];
  });
  const [categoryFlag, setCategoryFlag] = React.useState<boolean>(false);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  let keys = tableData[0] !== undefined && Object.keys(tableData[0][0]);
  let i: number;
  let str: string = '';
  let columns = [];

  // columns table Create
  i = 0;
  while (true) {
    if (tableData[0] === undefined) break;
    if (i >= keys.length) break;
    str = keys.at(i);

    // CheckBox
    if (i === 0) {
      columns.push(
        columnHelper.accessor('check', {
          id: 'check',
          header: () => (
            <Text
              justifyContent="space-between"
              align="center"
              fontSize={{ sm: '10px', lg: '12px' }}
              color="gray.400"
            >
              선택
            </Text>
          ),
          cell: (info: any) => (            
            <Flex align="center" justifyContent="center">
              <Checkbox
                justifyContent="center"
                defaultChecked={info?.getValue()?.[1] || false}
                colorScheme="brandScheme"
                me="10px"
                id={str}
                name={str}
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
            <Tooltip label={str}>
              <Text
                justifyContent="space-between"
                align="center"
                fontSize={{ sm: '10px', lg: '12px' }}
                color="gray.400"
              >
                {str.length >= 10 ? str.slice(0, 5) : str}
              </Text>
            </Tooltip>;
          },
          cell: (info: any) => {            
            return (
              <Tooltip label={info.getValue()}>
                <Text color={textColor} fontSize="xs" fontWeight="700">
                  {info.getValue() !== undefined &&
                    info.getValue() !== null &&
                    // info.getValue()
                    (info.column.id === 'accuracy'
                      ? info.getValue() === 100
                        ? '정탐'
                        : '확인필요'
                      : info.getValue().length >= 5
                      ? info.getValue().slice(0, 5) + '...'
                      : info.getValue())}
                </Text>
              </Tooltip>
            );
          },
        }),
      );
    }

    i++;
  }

  React.useEffect(() => {
    setData(tableData[0]);
  }, [tableData]);

  React.useEffect(() => {
    setPage(0);
    setCategoryFlag(false);
  }, [name]);

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
  });

  if(keys.length !== undefined && categoryFlag === false) {
    setCategoryFlag(true);
    setSearch(keys.at(1));
  }

  // Paging
  const handlePageClick = (p: number) => {
    setPage(p);
  };  

  // handlers

  const handleRows = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRows = parseInt(e.target.value, 10); // Assuming you want to parse the value as an integer
    setRows(newRows);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setSearch(e.target.value);
  };

  const handleSearchResult = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.target.value);
  };

  const handleSearchComfirm = () => {
    setSearchComfirm(!searchComfirm);
  };

  if (data === undefined || data === null) {
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
        w="100%"
        px="0px"
        overflowX={{ sm: 'scroll', lg: 'scroll' }}
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
          {/* <Menu /> */}
          <Box>
            <Flex>
              <Select
                fontSize="sm"
                variant="subtle"
                value={rows}
                onChange={handleRows}
                width="unset"
                fontWeight="700"
              >
                <option value="5">5개</option>
                <option value="10">10개</option>
                <option value="50">50개</option>
              </Select>
              <Select
                fontSize="sm"
                variant="subtle"
                value={search}
                onChange={handleSearch}
                width="unset"
                fontWeight="700"
              >
                {tableData[0] !== undefined &&
                  keys.map((data,index) => {
                    if(index !== 0) {
                      return (
                        <option value={data} key={data}>
                          {data}
                        </option>
                      );
                    }
                  })}
              </Select>
              <Input
                placeholder="검색"
                id="searchText"
                name="searchText"
                value={searchResult}
                onChange={handleSearchResult}
              />
              <IconButton
                aria-label="Search database"
                icon={<SearchIcon />}
                onClick={handleSearchComfirm}
              />
            </Flex>
          </Box>
        </Flex>
        <Box>
          <Table variant="simple" color="gray.500" mb="24px" mt="12px">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        pe="10px"
                        borderColor={borderColor}
                        cursor="pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <Flex
                          justifyContent="space-between"
                          align="center"
                          fontSize={{ sm: '10px', lg: '12px' }}
                          color="gray.400"
                        >
                          {flexRender(header.id, header.getContext())}
                          {{
                            asc: <FaSortUp />,
                            desc: <FaSortDown />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </Flex>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {table !== undefined &&
                table
                  .getRowModel()
                  .rows.slice(0, rows)
                  .map((row) => {
                    return (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <Td
                              key={cell.id}
                              fontSize={{ sm: '14px' }}
                              minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                              borderColor="transparent"
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
      </Card>
    );
  }
}
