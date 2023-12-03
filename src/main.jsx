import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import {
  // getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  // rainbowWallet,
  // walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  // mainnet,
  polygon
  // optimism,
  // arbitrum,
  // base,
  // zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [polygon],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains })
    ]
  } 
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors, //: [new InjectedConnector({chains})],
  publicClient
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
)
