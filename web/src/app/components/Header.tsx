import { HStack, Heading } from '@chakra-ui/react';

export const Header: React.FC = () => {
  return (
    <HStack
      as='header'
      w='full'
      align='center'
      justifyContent='space-evenly'
      p={4}
      bg='blue.900'
    >
      <Heading as='h1' size='lg' color='white' textAlign='center'>
        Google Search Results
      </Heading>
    </HStack>
  );
};
