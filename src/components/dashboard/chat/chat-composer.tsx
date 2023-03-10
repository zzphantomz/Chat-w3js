import type { FC } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider } from '@mui/material';
import { useDispatch } from '../../../store';
import { addMessage } from '../../../thunks/chat';
import type { Contact } from '../../../types/chat';
import { ChatComposerToolbar } from './chat-composer-toolbar';
import { ChatMessageAdd } from './chat-message-add';
import {useMoralis} from "react-moralis";
import EthCrypto from "eth-crypto";
import {setGuestKey} from "../../../slices/keyEth";

interface ChatComposerProps {}

export const ChatComposer: FC<ChatComposerProps> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [recipients, setRecipients] = useState<Contact[]>([]);
  const {user, Moralis} = useMoralis()

  const handleAddRecipient = (recipient: Contact): void => {
    setRecipients((prevState) => {
      // const exists = prevState.find((_recipient) => _recipient.id === recipient.id);
      //
      // if (!exists) {
      //   return [...recipients, recipient];
      // }

      return [...prevState, recipient];
    });
  };

  const handleRemoveRecipient = (recipientId: string): void => {
    setRecipients((prevState) => prevState.filter(
      (recipient) => recipient.id !== recipientId)
    );
  };

  const handleSendMessage = async (body: string): Promise<void> => {
    try {
      const Messages = Moralis.Object.extend('Contacts')
      let threadId = user?.get('ethAddress')
      recipients.forEach((recipient) => {
        threadId += ('to' + recipient.id.toLowerCase())})
      const messages = new Messages()
      messages.save({
        threadID: threadId,
      })
      router.push(`/dashboard/chat?threadKey=${threadId}`).catch(console.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}
      {...props}
    >
      <ChatComposerToolbar
        onAddRecipient={handleAddRecipient}
        onRemoveRecipient={handleRemoveRecipient}
        recipients={recipients}
      />
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1
        }}
      />
      <Divider />
      <ChatMessageAdd
        disabled={recipients.length === 0}
        onSend={handleSendMessage}
      />
    </Box>
  );
};
