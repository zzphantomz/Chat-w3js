import type {FC} from 'react';
import {useRouter} from 'next/router';
import {Box, Button} from '@mui/material';
import {useAuth} from '../../hooks/use-auth';
import {useMounted} from '../../hooks/use-mounted';
import {useMoralis} from "react-moralis";
import {useState} from "react";
import Moralis from 'moralis-v1';


export const JWTLogin: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth();
  const [authError, setAuthError] = useState<null | Error>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const {authenticate, enableWeb3} = useMoralis()

  const handleAuth = async (provider: 'metamask' | 'walletconnect' | 'magicLink' | 'web3Auth' = 'metamask') => {
    try {
      setAuthError(null);
      setIsAuthenticating(true);
      // Enable web3 to get user address and chain
      await enableWeb3({ throwOnError: true, provider });
      const { account, chainId } = Moralis;

      if (!account) {
        throw new Error('Connecting to chain failed, as no connected account was found');
      }
      if (!chainId) {
        throw new Error('Connecting to chain failed, as no connected chain was found');
      }

      // Get message to sign from the auth api
      const { message } = await Moralis.Cloud.run('requestMessage', {
        address: account,
        chain: parseInt(chainId, 16),
        networkType: 'evm',
      });

      // Authenticate and login via parse
      await authenticate({
        signingMessage: message,
        throwOnError: true,
      });
      router.push('/dashboard');
    } catch (error) {
      setAuthError(error);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={()=>{handleAuth("metamask")}} >
          Log In
      </Button>
    </Box>
  );
};
