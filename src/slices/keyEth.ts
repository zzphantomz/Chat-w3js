import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { Contact, Message, Thread } from '../types/chat';
import { objFromArray } from '../utils/obj-from-array';

interface KeyEthState {
  publicKey: string;
  guestPublicKey: string;
  privateKey: string;
}

const initialState: KeyEthState = {
  publicKey: '',
  guestPublicKey: '',
  privateKey: ''
};

export const slice = createSlice({
  name: 'keyEth',
  initialState,
  reducers: {
    setPublicKey(state: KeyEthState, action: PayloadAction<string>): void {
      state.publicKey = action.payload;
    },
    setGuestKey(state: KeyEthState, action: PayloadAction<string>): void {
      state.guestPublicKey = action.payload;
    },
    setPrivateKey(state: KeyEthState, action: PayloadAction<string>): void {
      state.privateKey = action.payload;
    }

  }
});

export const {setPublicKey, setGuestKey, setPrivateKey } = slice.actions;

export const { reducer } = slice;
