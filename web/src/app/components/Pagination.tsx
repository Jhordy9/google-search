import { Button, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Flex justifyContent='flex-end' alignItems='center' h='auto' mb={5}>
      <Button
        size='xs'
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage <= 1}
        leftIcon={<ChevronLeftIcon boxSize={5} />}
        iconSpacing={0}
      >
        Prev
      </Button>
      <Text mx={2}>
        Pages {currentPage} of {totalPages}
      </Text>
      <Button
        size='xs'
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
        rightIcon={<ChevronRightIcon boxSize={5} />}
        iconSpacing={0}
      >
        Next
      </Button>
    </Flex>
  );
};
