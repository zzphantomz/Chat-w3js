import type { FC } from 'react';
import { useRouter } from 'next/router';
import {Box, Button, Typography} from '@mui/material';
import {useMounted} from "@/hooks/useMounted";
import {connectAccount} from "@/slice/accountSlice";
import { useDispatch, useSelector } from '@/store';


export const WalletLogin: FC = (props) => {
  const account = useSelector((state) => state.account)

  const dispatch = useDispatch()

    console.log('account', account)
  function onWalletListItemClick(walletName: string) {
    return () => {
      // @ts-ignore
      dispatch(connectAccount(walletName))
    }
  }



  const connectWallet = () =>{
    // @ts-ignore
    console.log('connectWallet')
    // @ts-ignore
    dispatch(onWalletListItemClick('metamask'))
  }

  const renderWalletList = () => {

  }

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={connectWallet}
      >
        Connect Wallet
      </Button>
      <Typography>
        {account?.address}
      </Typography>

    </Box>
  );
};
