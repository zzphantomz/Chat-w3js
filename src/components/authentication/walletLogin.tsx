import type {FC} from 'react';
import {Box, Button, Typography} from '@mui/material';
import {connectAccount} from "@/slice/accountSlice";
import {useDispatch, useSelector} from '@/store';


export const WalletLogin: FC = (props) => {
  const account = useSelector((state) => state.account)

  const dispatch = useDispatch()




  const connectWallet = (walletName:string) => () =>{
    return () => {
      dispatch(connectAccount(walletName))
    }
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={connectWallet('metamask')}
      >
        Connect Wallet
      </Button>
      <Typography>
        {account?.address}
      </Typography>

    </Box>
  );
};
