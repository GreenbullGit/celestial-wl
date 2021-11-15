import { useEffect, useState } from "react";
import styled from "styled-components";
import Countdown from "react-countdown";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

const ConnectButton = styled(WalletDialogButton)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
});

const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)({
  color: 'darkslategray',
  backgroundColor: 'aliceblue',
  padding: 8,
  borderRadius: 4,
}); // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [api_url, setUrl] = useState(process.env.REACT_APP_API_URL)
  const [balance, setBalance] = useState<number>();
  const [isActive, setIsActive] = useState(false); // true when countdown completes
  const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [isWhitelisted, SetWhitelisted] = useState(false);
  const [hasReserves, SetHasReserves] = useState(false);

  const [itemsAvailable, setItemsAvailable] = useState(0);
  const [itemsRedeemed, setItemsRedeemed] = useState(0);
  const [itemsRemaining, setItemsRemaining] = useState(0);

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const refreshCandyMachineState = () => {
    (async () => {
      if (!wallet) return;

      const {
        candyMachine,
        goLiveDate,
        itemsAvailable,
        itemsRemaining,
        itemsRedeemed,
      } = await getCandyMachineState(
        wallet as anchor.Wallet,
        props.candyMachineId,
        props.connection
      );

      setItemsAvailable(itemsAvailable);
      setItemsRemaining(itemsRemaining);
      setItemsRedeemed(itemsRedeemed);

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);

    })();
  };

  const onMint = async () => {
    try {
      let res = await fetch(`${api_url}/whitelisted/member/${(wallet as anchor.Wallet).publicKey.toString()}`, {method: "GET"})
      const res_json = await res.json()
      const res_num = await JSON.parse(JSON.stringify(res_json)).reserve //The number  of reserves the user has left
      if(!isWhitelisted){
        throw new Error("You are not whitelisted");
      }
      if(res_num - 1 < 0){
        console.log("confirmed")
        throw new Error("Not enough reserves");
      }
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
          const to_send = await JSON.stringify({"reserve": res_num-1})
          const response = await fetch(`${api_url}/whitelisted/update/${(wallet as anchor.Wallet).publicKey.toString()}/${process.env.REACT_APP_SECRET_KEY}`, {
            method: "PUT",
            headers: {
            'Content-Type': 'application/json',
            },
            body: to_send})
          console.log("Updated Reserves for user")
          const responseData = await response.json();
          if (responseData.reserve == 0){
            SetHasReserves(false);
          }

        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.message || "Minting failed! Please try again!";
      if (!error.message) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        } else if (error.message === "You are not whitelisted"){
          message = error.message;
        } else if (error.message === "Not enough reserves"){
          message = error.message
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
      refreshCandyMachineState();
    }
  };

  const [images,setImages] = useState([
    "img/8.png",
    "img/12.png",
    "img/20.png",
  ]);
  const [currentImage,setCurrentImage] = useState(0);
  var intervalId;

  const switchImage = () => {
    if (currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    } else {
      setCurrentImage(0);
      }
    return currentImage;
  }

  useEffect(() => {
      window.setTimeout(switchImage, 2000)
  },[currentImage]);

  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
        const data = await fetch(`${api_url}/whitelisted/member/${(wallet as anchor.Wallet).publicKey.toString()}`)
        if(data.status.toString() !== "404"){
          const jsonData = await data.json();
          SetWhitelisted(true)
          if(jsonData.reserve > 0){
            SetHasReserves(true)
          }
        }
        else{
          console.log("not found")
        }
      }
    })();
  }, [wallet, props.connection]);

  useEffect(refreshCandyMachineState, [
    wallet,
    props.candyMachineId,
    props.connection,
  ]);

  return (
    <main>
      <nav id='menu' className='navbar navbar-default'>
      <div className='container'>
        <div className='navbar-header'>
          
          <a className='navbar-brand page-scroll' href='#page-top'>
            Celestial Body Shop
          </a>{' '}
          <ul className='nav navbar-nav navbar-right'>
            <li className='social-button'>
            <a href={'/'}>
                      <i className='fa fa-lg fa-twitter page-scroll social-button'></i>
                    </a>
            </li>
            <li className='social-button'>
            <a href={ '/'}>
                      <i className='fab fa-lg fa-discord page-scroll social-button'></i>
                    </a>
            </li>
            <li>
              {!wallet ? (
                <ConnectButton>Connect Wallet</ConnectButton>
               ) :
               <a href={ '/'}>
                      Connected wallet: {shortenAddress(wallet.publicKey.toBase58())}
                    </a>}
            </li>
          </ul>
        </div>

        
      </div>
    </nav>
    <header id='header'>
      <div className='col-md-12 intro'>
        <div className="col-sm-4 minter-container">
        {wallet &&    
          <div className='col-md-6 grid'>
            <p className='counter-text'>Cars left in the bodyshop </p>
            <p className='counter-text'>{itemsRemaining} / 4444</p>
              <MintContainer>
              <MintButton
                disabled={!isWhitelisted || isSoldOut || isMinting || !isActive || !hasReserves} //change happened here
                onClick={onMint}
                variant="contained"
                className="fuckubutton"
              >
                {isSoldOut ? (
                  "SOLD OUT"
                ) : isActive ? (
                  isMinting ? (
                    <CircularProgress />
                  ) : (
                    "MINT MINE"
                  )
                ) : (
                  <Countdown
                    date={startDate}
                    onMount={({ completed }) => completed && setIsActive(true)}
                    onComplete={() => setIsActive(true)}
                    renderer={renderCounter}
                  />
                )}
              </MintButton>
              </MintContainer>
          </div>
        }
        {!wallet && 
          <div className='col-md-6 grid'>
           <p className='counter-text'>Connect your wallet first </p>
            </div>
        }
          <div className='col-md-6 pic-box'>
            
                  <img src={images[currentImage]} className="img-responsive mint-pic" alt="" />{" "}
           
          </div>
        </div>
        
      </div>
    </header>
      {wallet && (
        <p>Wallet {shortenAddress(wallet.publicKey.toBase58() || "")}</p>
      )}

      {wallet && <p>Balance: {(balance || 0).toLocaleString()} SOL</p>}

      {wallet && <p>Total Available: {itemsAvailable}</p>}

      {wallet && <p>Redeemed: {itemsRedeemed}</p>}

      {wallet && <p>Remaining: {itemsRemaining}</p>}

      

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours + (days || 0) * 24} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
};

export default Home;
