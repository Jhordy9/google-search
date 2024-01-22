'use client';
import { useState, useEffect, useCallback, useMemo, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Stack,
  HStack,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import { Header } from './components/Header';
import { useDebounce } from './hooks/useDebounce';
import { Pagination } from './components/Pagination';
import useSWR, { mutate } from 'swr';
import { fetcher, sendRequest } from './utils';
import useSWRMutation from 'swr/mutation';

interface ApiResult {
  title: string;
  link: string;
  snippet: string;
  keyword: string;
}

interface ApiResponse {
  results: ApiResult[];
  info: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

const ResultsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [results, setResults] = useState<ApiResult[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const [keywordFilter, setKeywordFilter] = useState('');
  const debouncedValue = useDebounce<string>(keywordFilter, 500);
  const urlResults = `http://localhost:4000/search?page=${currentPage}&limit=25&keyword=${debouncedValue}`;
  const urlSearch = 'http://localhost:4000/search';

  const { data: resultData, mutate } = useSWR<ApiResponse>(
    urlResults,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const { trigger, isMutating } = useSWRMutation(urlSearch, sendRequest);

  useEffect(() => {
    if (resultData) {
      setResults(resultData.results);
      setTotalPages(Number(resultData.info.totalPages));
      setCurrentPage(Number(resultData.info.currentPage));
    }
  }, [resultData]);

  const handleSearch = useCallback(async () => {
    await trigger({ keyword: searchTerm });
    setSearchTerm('');
  }, [searchTerm, trigger]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterByKeyWord = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setKeywordFilter(e.currentTarget.value);
      mutate();
    },
    [mutate]
  );

  return (
    <>
      <Header />
      <VStack spacing={4} align='center' pt={4}>
        <HStack spacing={4}>
          <Input
            placeholder='Enter search term'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            colorScheme='blue'
            onClick={handleSearch}
            isDisabled={isMutating}
          >
            Search
          </Button>
        </HStack>
        <Input
          placeholder='Filter by keyword'
          value={keywordFilter}
          onChange={handleFilterByKeyWord}
          maxW='30%'
          w='30%'
        />
        {results.map((result, index) => (
          <VStack
            alignItems='flex-start'
            key={index}
            borderWidth='1px'
            p={4}
            spacing={2}
            borderRadius='md'
            w='70%'
            maxW='100%'
            h='180px'
            maxH='100%'
          >
            <Text fontWeight='bold'>Keyword: {result.keyword}</Text>
            <Text>Title: {result.title}</Text>
            <Text>Snippet: {result.snippet}</Text>
            <Tooltip
              hasArrow
              label={result.link}
              aria-label='Link'
              placement='bottom'
              isDisabled={result.link.length < 140}
            >
              <Text isTruncated noOfLines={1} w='100%'>
                Link: <Link isExternal>{result.link}</Link>
              </Text>
            </Tooltip>
          </VStack>
        ))}
        <HStack spacing={2} mt={4}>
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </HStack>
      </VStack>
    </>
  );
};

export default ResultsList;
