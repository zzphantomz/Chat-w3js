import type { FC } from 'react';
import { useRouter } from 'next/router';
import {Box, Button, Typography} from '@mui/material';
import {useMounted} from "@/hooks/useMounted";
import {connectAccount} from "@/slice/accountSlice";
import { useDispatch, useSelector } from '@/store';


export const WalletLogin: FC = (props) => {
  const account = useSelector((state) => state.account)

  const dispatch = useDispatch()

  function onWalletListItemClick(walletName: string) {
    return () => {
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
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color={'error'}
        sx={{ mt: 2 }}
        onClick={connectWallet}
      >
            disconnect
      </Button>
      <Typography>
        {account?.address}
      </Typography>

    </Box>
  );
};
