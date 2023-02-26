import type { FC } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import type { Message, Participant } from '../../../types/chat';
import { ChatMessage } from './chat-message';
import { useMoralis } from 'react-moralis';

interface ChatMessagesProps {
  messages: Message[];
  participants: Participant[];
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
  const { messages, participants, ...other } = props;
  // To get the user from the authContext, you can use
  const {user:userWallet} = useMoralis()
  // `const { user } = useAuth();`
  const user = {
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    name: 'Anika Visser'
  };

  return (
    <Box
      sx={{ p: 2 }}
      {...other}
    >
      {messages.map((message) => {
        const participant = participants.find(
          (_participant) => _participant.id === message.authorId
        );
        let authorAvatar: string | null;
        let authorName: string;
        let authorType: 'user' | 'contact';

        // Since chat mock db is not synced with external auth providers
        // we set the user details from user auth state instead of thread participants
        if (message.authorId === userWallet?.get('ethAddress')) {
          authorAvatar = user.avatar;
          authorName = 'Me';
          authorType = 'user';
        } else {
          authorAvatar = '/static/mock-images/avatars/avatar-anika_visser.png';
          authorName ='Anika Visser';
          authorType = 'contact';
        }

        return (
          <ChatMessage
            authorAvatar={authorAvatar}
            authorName={authorName}
            authorType={authorType}
            body={message.body}
            contentType={message.contentType}
            createdAt={message.createdAt}
            key={message.id}
          />
        );
      })}
    </Box>
  );
};

ChatMessages.propTypes = {
  // @ts-ignore
  messages: PropTypes.array,
  // @ts-ignore
  participants: PropTypes.array
};
