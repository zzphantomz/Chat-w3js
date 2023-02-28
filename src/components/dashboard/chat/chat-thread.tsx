import type {FC} from 'react';
import {useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import {Box, Divider} from '@mui/material';
import type {RootState} from '../../../store';
import type {Participant, Thread} from '../../../types/chat';
import {Message} from "../../../types/chat";
import {Scrollbar} from '../../scrollbar';
import {ChatMessageAdd} from './chat-message-add';
import {ChatMessages} from './chat-messages';
import {ChatThreadToolbar} from './chat-thread-toolbar';
import {useMoralis, useMoralisQuery} from "react-moralis";
import lodash from 'lodash'

interface ChatThreadProps {
  threadKey: string;
}

const threadSelector = (state: RootState): Thread | undefined => {
  const { threads, activeThreadId } = state.chat;

  return threads.byId[activeThreadId as string];
};

export const ChatThread: FC<ChatThreadProps> = (props) => {
  const { threadKey } = props;
  const {user:userWallet, Moralis} = useMoralis()
  const time = new Date(Date.now()- 1000*60*60*24*7)
  const router = useRouter();
  const [thread, setThread] = useState<Thread | undefined>(undefined);
  const {data} = useMoralisQuery('Messenger', (query) => {
    return query.ascending("createdAt").greaterThan("createdAt", new Date(Date.now()- 1000*60*60*24*7))
  },[threadKey],{
    live:true
  })


  useEffect(() => {

    if(data){
      const participantsID = threadKey.split('to')
      const messages = data.map((message:any) => {
        const data = lodash.get(message, 'attributes',{})

        return {
          id: message.id,
          attachments:[],
          body:data.message,
          contentType: 'text',
          createdAt: data.createdAt,
          authorId:data.authorId,
          participants:data.participants,
        }
      })

      const filterMessages = messages.filter((message:Message) => {
        if (!message.participants) return false
        return message.participants.includes(participantsID[1])&&message.participants.includes(participantsID[0])
      })
      console.log(filterMessages)
      setThread({
        messages: filterMessages,
        participantIds: participantsID,
        type: 'ONE_TO_ONE'
      })
    }
  }, [data, threadKey])

  const messagesRef = useRef<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    id: '5e86809283e28b96d2d38537'
  };

  const getDetails = async (): Promise<void> => {
    try {

    } catch (err) { }
    //   const _participants = await chatApi.getParticipants({ threadKey });
    //
    //   setParticipants(_participants);
    //
    //   // @ts-ignore
    //   const threadId: string = await dispatch(getThread({
    //     threadKey
    //   }));
    //
    //   dispatch(setActiveThread({
    //     threadId
    //   }));
    //   dispatch(markThreadAsSeen({
    //     threadId
    //   }));
    // } catch (err) {
    //   // If thread key is not a valid key (thread id or contact id)
    //   // the server throws an error, this means that the user tried a shady route
    //   // and we redirect them on the home view
    //   console.error(err);
    //   router.push(`/dashboard/chat`).catch(console.error);
    // }
  };

  useEffect(
    () => {
      getDetails();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [threadKey]
  );

  useEffect(
    () => {
      // Scroll to bottom of the messages after loading the thread
      if (thread?.messages && messagesRef?.current) {
        const scrollElement = messagesRef.current.getScrollElement();

        scrollElement.scrollTop = messagesRef.current.el.scrollHeight;
      }
    },
    [thread]
  );

  // If we have the thread, we use its ID to add a new message
  // Otherwise we use the recipients IDs. When using participant IDs, it means that we have to
  // get the thread.
  const handleSendMessage = (body: string):void => {



    try {
      const Messages = Moralis.Object.extend('Messenger')
      const messages = new Messages()
      messages.save({
        message: body,
        attachments: [],
        contentType: 'text',
        createdAt: Date.now(),
        userName: userWallet?.getUsername(),
        authorId: userWallet?.get('ethAddress'),
        participants: threadKey,
      }).then((result: any) => {console.log(result, 'result')})
    }
    catch (error) {
      console.log(error, 'error')
    }
    // console.log(body)
    // try {
    //   if (thread) {
    //     await dispatch(addMessage({
    //       threadId: thread.id,
    //       body
    //     }));
    //   } else {
    //     const recipientIds = participants
    //       .filter((participant) => participant.id !== user.id)
    //       .map((participant) => participant.id);
    //
    //     // @ts-ignore
    //     const threadId: string = await dispatch(addMessage({
    //       recipientIds,
    //       body
    //     }));
    //
    //     await dispatch(getThread({
    //       threadKey: threadId
    //     }));
    //     // @ts-ignore
    //     dispatch(setActiveThread(threadId));
    //   }
    //
    //   // Scroll to bottom of the messages after adding the new message
    //   if (messagesRef?.current) {
    //     const scrollElement = messagesRef.current.getScrollElement();
    //
    //     scrollElement.scrollTo({
    //       top: messagesRef.current.el.scrollHeight,
    //       behavior: 'smooth'
    //     });
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflow: 'hidden'
      }}
      {...props}
    >
      <ChatThreadToolbar participants={participants} />
      <Box
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        <Scrollbar
          ref={messagesRef}
          sx={{ maxHeight: '100%' }}
        >
          <ChatMessages
            messages={thread?.messages || []}
            participants={thread?.participants || []}
          />
        </Scrollbar>
      </Box>
      <Divider />
      <ChatMessageAdd
        disabled={false}
        onSend={handleSendMessage}
      />
    </Box>
  );
};

ChatThread.propTypes = {
  threadKey: PropTypes.string.isRequired
};
