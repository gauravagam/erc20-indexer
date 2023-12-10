import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  // connectorsForWallets,
  getDefaultWallets
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  // rainbowWallet,
  // walletConnectWallet,
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  goerli
  // optimism,
  // arbitrum,
  // base,
  // zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'


const { chains, publicClient } = configureChains(
  [mainnet, polygon,goerli],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "erc20-indexer",
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  logger: {
    warn: (message) => logWarn(message),
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider toastOptions={{ defaultOptions: { position: 'top-right' } }}>
          <App />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
