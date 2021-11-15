import "./App.css";
import { useMemo } from "react";

import Home from "./Home";

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";

const treasury = new anchor.web3.PublicKey(
  process.env.REACT_APP_TREASURY_ADDRESS!
);

const config = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_CONFIG!
);

const candyMachineId = new anchor.web3.PublicKey(
  process.env.REACT_APP_CANDY_MACHINE_ID!
);

const network = process.env.REACT_APP_SOLANA_NETWORK as WalletAdapterNetwork;

const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
const connection = new anchor.web3.Connection(rpcHost);

const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const theme = createTheme({
    palette: {
      type: 'dark',
  },
    overrides: {
        MuiButtonBase: {
            root: {
                justifyContent: 'flex-start',
                "&$focusVisible": {
                  "backgroundColor": "#ff53e8"
                }
            },
        },
        MuiButton: {
            root: {
                textTransform: undefined,
                padding: '12px 16px',
                
            },
            containedPrimary: {
              backgroundColor: '#1a1a1a',
              borderColor: '#ff92ee',
              color: '#fff',
              border: '1px solid',
              fontFamily: 'Raleway, sans-serif',
              WebkitTextStrokeWidth: '1px',
              WebkitTextStrokeColor: '#ff92ee',
              textTransform: 'uppercase',
              fontSize: '18px',
              padding: '5px 0px',
              marginRight: '10px',
              fontWeight: 'bold',
              "&:hover": {
                backgroundColor: "#ffb6f2",
                WebkitTextStrokeColor: 'black',
                color: 'black',
              }
            },
            outlinedPrimary: {
              backgroundColor: '#ff53e8'
            },
            outlined: {
              "&:hover": {
                backgroundColor: "#35C37D"
              }
            },
            

            
            startIcon: {
                marginRight: 8,
            },
            endIcon: {
                marginLeft: 8,
            },
        },
        MuiDialogTitle: {
          root: {
            backgroundColor: '#1a1a1a !important' ,
            fontFamily: 'Raleway, sans-serif',
              WebkitTextStrokeWidth: '1px',
              WebkitTextStrokeColor: '#ff92ee',
              color: '#fff',
          }
        },
        MuiDialogContent: {
          root: {
            margin: '0px !important',
          }
        }
    },
});

const App = () => {
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const wallets = useMemo(
    () => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network })
    ],
    []
  );

  return (
      <>
        
        <ThemeProvider theme={theme}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
              <WalletDialogProvider>
              
                <Home
                  candyMachineId={candyMachineId}
                  config={config}
                  connection={connection}
                  startDate={startDateSeed}
                  treasury={treasury}
                  txTimeout={txTimeout}
                />
              </WalletDialogProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ThemeProvider>
      </>
  );
};

export default App;
