import type {ChangeEvent, FC, MutableRefObject} from 'react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import type {Theme} from '@mui/material';
import {Box, Button, Drawer, IconButton, List, Typography, useMediaQuery} from '@mui/material';
import {styled} from '@mui/material/styles';
import {chatApi} from '../../../__fake-api__/chat-api';
import {Plus as PlusIcon} from '../../../icons/plus';
import {X as XIcon} from '../../../icons/x';
import {useSelector} from '../../../store';
import type {Contact} from '../../../types/chat';
import {Thread} from "../../../types/chat";
import {Scrollbar} from '../../scrollbar';
import {ChatContactSearch} from './chat-contact-search';
import {ChatThreadItem} from './chat-thread-item';
import {useMoralis, useMoralisQuery} from "react-moralis";
import lodash from "lodash";

interface ChatSidebarProps {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  onClose?: () => void;
  open?: boolean;
}

const ChatSidebarDesktop = styled(Drawer)({
  flexShrink: 0,
  width: 380,
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 380
  }
});

const ChatSidebarMobile = styled(Drawer)({
  maxWidth: '100%',
  width: 380,
  '& .MuiDrawer-paper': {
    height: 'calc(100% - 64px)',
    maxWidth: '100%',
    top: 64,
    width: 380
  }
});

export const ChatSidebar: FC<ChatSidebarProps> = (props) => {
  const { containerRef, onClose, open, ...other } = props;
  const router = useRouter();
  const { threads, activeThreadId } = useSelector((state) => state.chat);
  const [threadsChat, setThreadsChat] = useState<Contact[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const mdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const [thread, setThread] = useState<Thread[] | undefined>(undefined);


  const {user:userWallet, Moralis} = useMoralis()

  const {data} = useMoralisQuery('Contacts', (query) => {
    return query.ascending("createdAt").greaterThan("createdAt", new Date(Date.now()- 1000*60*60*24*7))
  },[],{
    live:true
  })

  const {data:dataThreads} = useMoralisQuery('Messenger', (query) => {
    return query.ascending("createdAt").greaterThan("createdAt", new Date(Date.now()- 1000*60*60*24*7))
  },[],{
    live:true
  })

  function arrayCompare(_arr1:[], _arr2:[]) {
    if (
      !Array.isArray(_arr1)
      || !Array.isArray(_arr2)
      || _arr1.length !== _arr2.length
    ) {
      return false;
    }

    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    console.log(data)
    if (data) {
      let removeDuplicates:any[] = []
      data.forEach((item:any) => {
        const index = removeDuplicates.findIndex((itemRemove:any) => {

          const itemRemoveArray = itemRemove.attributes.threadID.split('to')
          const itemArray = item.attributes.threadID.split('to')
          const check = arrayCompare(itemRemoveArray, itemArray)
          return  (itemRemove.attributes.threadID === item.attributes.threadID)||check
        })

        const valid = removeDuplicates.findIndex((itemRemove:any) => itemRemove.attributes.threadID === item.attributes.threadID)

        if (!(index > -1)){
          removeDuplicates.push(item)
        }
      })

      const threadsChat = removeDuplicates.map((item:any) => {
        const data = lodash.get(item, 'attributes', {})
        const userIdChat = data?.threadID.split('to')
        let nameGuest
        userIdChat.forEach((item: any) => {
          if (item !== userWallet?.get('ethAddress')) {
            nameGuest = item
          }
        })


        const userChat = data?.threadID?.includes(userWallet?.get('ethAddress'))

        if (userChat) return {
          id: item.id.toString(),
          avatar: '/static/mock-images/avatars/avatar-jie_yan_song.png',
          isActive: false,
          name: nameGuest??"",
          threadId: data?.threadID??"",
        } as Contact
        return {} as Contact
      })
      console.log(threadsChat)

      setThreadsChat(threadsChat)
    }
  }, [data])

  useEffect(() => {

    if(dataThreads){
      let participantsID:string[] =[]
      dataThreads.forEach((message:any) => {
        const data = lodash.get(message, 'attributes',{})
        const id = data.participants
        const have = participantsID.find((item:any) => item === id.participants)
        if(!have){
          participantsID.push(id)
        }
      })
      const threadIs = participantsID.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })

      const messages = dataThreads.map((message:any) => {
        const dataMap = lodash.get(message, 'attributes',{})
        return {
          id: message.id,
          attachments:[],
          body:dataMap.message,
          contentType: 'text',
          createdAt: dataMap.createdAt,
          authorId:dataMap.authorId,
          participants:dataMap.participants,
        }
      })
      const threads = threadIs.map((thead:any) => {
        const userInThread = thead.split('to')
        const threadMessages = messages.filter((message:any) => {
          return message.participants?.includes(userInThread[0]) && message.participants?.includes(userInThread[1]) && message.participants?.includes(userWallet?.get('ethAddress'))
        })
        return {
          messages: threadMessages,
          participantIds: userInThread,
          type: 'ONE_TO_ONE'
        } as Thread
      } )
      setThread(threads)

    }

  }, [dataThreads])


  const handleGroupClick = (): void => {
    if (!mdUp) {
      onClose?.();
    }
  };

  const handleSearchClickAway = (): void => {
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSearchChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const { value } = event.target;

      setSearchQuery(value);

      if (value) {
        const data = await chatApi.getContacts({ query: value });

        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchFocus = (): void => {
    setIsSearchFocused(true);
  };

  const handleSearchSelect = (result: Contact): void => {
    setIsSearchFocused(false);
    setSearchQuery('');

    if (!mdUp) {
      onClose?.();
    }

    router.push(`/dashboard/chat?threadKey=${result.id}`).catch(console.error);
  };

  const handleSelectThread = (threadId: string): void => {
    router.push(`/dashboard/chat?threadKey=${threadId}`).catch(console.error);
  };

  const returnThread = (threadId: string): Thread => {
    const split = threadId?.split('to')??[]
    const dataReturn = thread?.find((_thread) => _thread.participantIds.includes(split[0]) && _thread.participantIds.includes(split[1]));
    if (!dataReturn) return {
      messages: [],
      participantIds: ['5e86809283e28b96d2d38537','5e86809283e28b96d2d38537'],
      type: 'ONE_TO_ONE'
    }
    return dataReturn
  }

  const content = (
    <div>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          p: 2
        }}
      >
        <Typography variant="h5">
          Chats
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <NextLink
          href="/dashboard/chat?compose=true"
          passHref
        >
          <Button
            component="a"
            onClick={handleGroupClick}
            startIcon={<PlusIcon />}
            variant="contained"
          >
            Group
          </Button>
        </NextLink>
        <IconButton
          onClick={onClose}
          sx={{
            display: {
              sm: 'none'
            },
            ml: 2
          }}
        >
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <ChatContactSearch
        isFocused={isSearchFocused}
        onChange={handleSearchChange}
        onClickAway={handleSearchClickAway}
        onFocus={handleSearchFocus}
        onSelect={handleSearchSelect}
        query={searchQuery}
        results={searchResults}
      />
      <Box
        sx={{
          borderTopColor: 'divider',
          borderTopStyle: 'solid',
          borderTopWidth: 1,
          display: isSearchFocused ? 'none' : 'block'
        }}
      >
        <Scrollbar>
          <List disablePadding>
            {threadsChat.map((threadId) => (
              <ChatThreadItem
                active={activeThreadId === threadId.id}
                key={threadId.id}
                onSelect={(): void => handleSelectThread(threadId.threadId as string)}
                thread={returnThread(threadId.threadId as string)}
              />
            ))}
          </List>
        </Scrollbar>
      </Box>
    </div>
  );

  if (mdUp) {
    return (
      <ChatSidebarDesktop
        anchor="left"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </ChatSidebarDesktop>
    );
  }

  return (
    <ChatSidebarMobile
      anchor="left"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </ChatSidebarMobile>
  );
};

ChatSidebar.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool
};
