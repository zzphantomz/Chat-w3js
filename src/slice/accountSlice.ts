import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

const initialState = {
  address: null,
  networkId: null,
  provider: null,
  connected: false,
  balance: 0,
  usdtBalance: 0,
  loading: false,
}

const connectWallet = (provider:any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await provider.send('eth_requestAccounts', [])
    } catch (error) {
      console.error(error)
    }

    try {
      const signer = provider.getSigner()
      resolve(signer.getAddress())
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}

export const connectAccount = createAsyncThunk(
  'accounts/connect',
  async (walletType, { dispatch }) => {
    const providerForWalletType = async (walletType:string) => {
      switch (walletType) {
      case 'metamask':
        // @ts-ignore
        return window.ethereum
      }
    }
    console.log('providerForWalletType', providerForWalletType)
    const provider = new ethers.providers.Web3Provider(
      // @ts-ignore
      await providerForWalletType(walletType),
    )

    connectWallet(provider).then(async (currentAddress) => {
      let address = currentAddress
      let networkId = (await provider.getNetwork()).chainId
      let signer = await provider.getSigner()
      let balance = await signer.getBalance()

      // const contract = new ethers.Contract(usdtContractAddress, [
      //   'function balanceOf(address owner) view returns (uint balance)',
      // ]).connect(signer)
      //
      const usdtBalance = 0
      dispatch(
        connected({ address, networkId, provider, balance, usdtBalance }),
      )
    })

  },
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(connectAccount.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(connectAccount.fulfilled, (state, action) => {
      state.loading = false
    })
    builder.addCase(connectAccount.rejected, (state, action) => {
      state.loading = false
    })
  },
  reducers: {
    updated: (state, { payload }) => {
      Object.assign(state, payload)
    },
    connected: (state, { payload }) => {
      state.address = payload.address
      state.networkId = payload.networkId
      state.provider = payload.provider
      state.balance = payload.balance
      state.usdtBalance = payload.usdtBalance
      state.connected = true
    },
  },
})

export const {
  connected,
  updated,
} = accountSlice.actions

export default accountSlice.reducer
