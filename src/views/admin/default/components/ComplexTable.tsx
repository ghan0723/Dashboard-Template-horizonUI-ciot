import {
  Box,
  Flex,
  Icon,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
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
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
// Assets
import { complexAlias} from 'utils/alias';

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable(props: { tableData: any }) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  let defaultData = tableData;
  let tableName =
    tableData?.table === 'network'
      ? '사외 네트워크 정보유출 실시간 현황'
      : tableData?.table === 'media'
      ? '이동식 저장매체 정보유출 실시간 현황'
      : tableData?.table === 'outlook'
      ? 'Outlook 메일 발송 실시간 현황'
      : '프린터 인쇄 실시간 현황';
  let columns = [];  
  for (let i = 0; i < defaultData?.key.length; i++) {
    columns.push(
      columnHelper.accessor(defaultData.key[i], {
        id: defaultData.key[i],
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="Black"
          >
            {defaultData.key[i]}
          </Text>
        ),
        cell: (info: any) => (
          <Tooltip label={info.getValue()}>
            <Flex align="center">
              <Text
                color={textColor}
                fontSize="sm"
                fontWeight="100"
                w={i === defaultData?.key.length - 1 ? 'auto' : '60px'}
              >
                {info.getValue()}
              </Text>
            </Flex>
          </Tooltip>
        ),
      }),
    );
  }
  const [data, setData] = React.useState(() => {
    return tableData?.data !== undefined && tableData?.data;
  });
  const router = useRouter();
  React.useEffect(() => {
    if (tableData?.data !== undefined) {
      setData(tableData.data);
    }
  }, [tableData?.data]);

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

  const routingTable = (e: any) => {
    tableData?.table === 'network'
      ? router.push('/data/tables?contents=network')
      : tableData?.table === 'media'
      ? router.push('/data/tables?contents=media')
      : tableData?.table === 'outlook'
      ? router.push('/data/tables?contents=outlook')
      : router.push('/data/tables?contents=print');
  };

  if (!tableData) {
    return <div>Loading...</div>; // 로딩 중일 때의 UI 처리
  }
  

  return (
    <Card
      borderRadius={'0px'}
      flexDirection="column"
      w="100%"
      px="0px"
      height="250px"
      overflowX={{ sm: 'hidden', lg: 'hidden' }}
      overflowY={{ sm: 'hidden', lg: 'hidden' }}
      p={'0px'}
    >
      <Flex
        height={'40px'}
        maxH={'40px'}
        minH={'40px'}
        alignSelf={'start'}
        width={'100%'}
        mt={'10px'}
        mb="8px"
        pl={'10px'}
        pr={'10px'}
      >
        <Text
          w="100%"
          justifySelf={'center'}
          lineHeight={'40px'}
          color={'#03619E'}
          fontSize={'18px'}
          fontWeight={900}
          cursor={'pointer'}
          onClick={routingTable}
        >
          {tableName}
        </Text>
      </Flex>
      <Box width="100%">
        {data.length !== 0 ? (
          <Table variant="simple" color="gray.500" mb="24px" width="100%">
            <Thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    let headerText = complexAlias[header.id];                    
                    return (
                      <Th
                        key={header.id}
                        colSpan={header.colSpan}
                        borderColor={borderColor}
                        cursor="pointer"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        width={
                          header.id === 'backup_file' ||
                          header.id === 'org_file' ||
                          header.id === 'sender' ||
                          header.id === 'doc_name'
                            ? 'auto' : '20%'
                        }
                        px={'10px'}
                        pt="5px"
                        pb="5px"
                        paddingInlineEnd="0px"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                          <Flex
                            justifyContent="space-between"
                            align="center"
                            fontSize={{ sm: '10px', lg: '12px' }}
                            color="gray.400"
                          >
                            {flexRender(
                              headerText,
                              header.getContext(),
                            )}
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
                table.getRowModel() &&
                table.getRowModel().rows &&
                table
                  .getRowModel()
                  .rows.slice(0, 5)
                  .map((row) => {
                    return (
                      <Tr key={row.id}>
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <Td
                              key={cell.id}
                              fontSize={{ sm: '12px' }}
                              fontWeight={'100'}
                              borderColor="transparent"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              px={'10px'}
                              pt="5px"
                              pb="5px"
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
        ) : (
			<Text ml={'10px'} fontSize={'17px'} fontWeight={'700'}>해당 데이터가 존재하지 않습니다!</Text>
        )}
      </Box>
    </Card>
  );
}
