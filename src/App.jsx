import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  Spinner,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { useEffect } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [error, setError] = useState('');
  const toast= useToast()
  
  async function getTokenBalance(userAddress) {
    try{
      setError('');
      setIsLoading(true)
      const config = {
        apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
        network: getNetworkForConfigByChain(chain.name),
      };

      const alchemy = new Alchemy(config);
      const data = await alchemy.core.getTokenBalances(userAddress);
  
      setResults(data);
  
      const tokenDataPromises = [];
  
      for (let i = 0; i < data.tokenBalances.length; i++) {
        const tokenData = alchemy.core.getTokenMetadata(
          data.tokenBalances[i].contractAddress
        );
        tokenDataPromises.push(tokenData);
      }
  
      setTokenDataObjects(await Promise.all(tokenDataPromises));
      setIsLoading(false)
    } catch(error){
      console.log('error ',error.message)
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 9000,
        position: 'top-right'
      })
    }
  }

  useEffect(()=>{
    if(isConnected){
      getTokenBalance(address);
    }
  },[isConnected,address,chain])

  const getNetworkForConfigByChain = (chainName)=>{
    switch(chainName){
      case "Ethereum":
        return Network.ETH_MAINNET;
      case "Goerli":
        return Network.ETH_GOERLI;
      case "Polygon":
        return Network.MATIC_MAINNET;
      default:
        return Network.ETH_MAINNET
    }
  }
  return (
    <Box w="100%">
      <Box w="100%" p={4} borderWidth='1px' bg={"#E2E8F0"} height={"fit-content"}>
	  	  <Heading fontSize={24} color="#8AAAE5" as="h1">
            ERC-20 Token Indexer
        </Heading>
      </Box>
      <Center mt={"20px"}>
      <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
        <Text paddingX={[4,0]}>
          Connect your wallet and this website will return all of its ERC-20 token balances!
        </Text>
        <ConnectButton accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }} 
        chainStatus={
          { smallScreen: "icon", largeScreen: "full" }
        } />
        </Flex>
        </Center>
        <Tabs variant="soft-rounded" colorScheme={"blue"} paddingX={[4,"50px"]}>
          <TabList>
            <Tab color={"#000000"}>ERC-20 Token</Tab>
            <Tab>NFT</Tab>
          </TabList>
          <TabPanels>
            <TabPanel paddingX={"0px"}>
              { isConnected && <Flex
                w="100%"
                flexDirection="column"
                alignItems="center"
                justifyContent={'center'}
              >
                { !error && <><Heading my={8} fontSize={24}>ERC-20 token balances:</Heading>
                {!isLoading ? (
                  <Flex columnGap={"12px"} rowGap={"15px"} wrap="wrap">
                    {results.tokenBalances.map((e, i) => {
                      return (
                        <Flex
                          flexDir={'column'}
                          color="#000000"
                          bg="#E2E8F0"
                          key={e.contractAddress}
                          p="15px"
                          width={["100%","210px"]}
                        >
                          <Box>
                            <b>Symbol:</b> ${tokenDataObjects[i]?.symbol}&nbsp;
                          </Box>
                          <Box>
                            <b>Balance:</b>&nbsp;
                            {Utils.formatUnits(
                              e.tokenBalance,
                              tokenDataObjects[i]?.decimals
                            )}
                          </Box>
                          <Image src={tokenDataObjects[i]?.logo} />
                        </Flex>
                      );
                    })}
                  
                  </Flex>
                ) : 
                <Spinner size="xl" thickness='4px'/>}</>}
              </Flex>}
            </TabPanel>
          </TabPanels>
        </Tabs>
      
    </Box>
  );
}

export default App;
