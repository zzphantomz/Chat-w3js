import type { FC } from 'react';
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Avatar,
  AvatarGroup,
  Box, Button,
  IconButton, Input,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem, Modal,
  Tooltip,
  Typography
} from '@mui/material';
import { Archive as ArchiveIcon } from '../../../icons/archive';
import { Bell as BellIcon } from '../../../icons/bell';
import { Ban as BanIcon } from '../../../icons/ban';
import { Camera as CameraIcon } from '../../../icons/camera';
import { Phone as PhoneIcon } from '../../../icons/phone';
import { DotsHorizontal as DotsHorizontalIcon } from '../../../icons/dots-horizontal';
import { Trash as TrashIcon } from '../../../icons/trash';
import type { Participant } from '../../../types/chat';
import {setGuestKey, setPrivateKey, setPublicKey} from "../../../slices/keyEth";
import {useDispatch} from "react-redux";

interface ChatThreadToolbarProps {
  participants: Participant[];
}

export const ChatThreadToolbar: FC<ChatThreadToolbarProps> = (props) => {
  const { participants, ...other } = props;
  const moreRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // To get the user from the authContext, you can use
  // `const { user } = useAuth();`
  const user = {
    id: '5e86809283e28b96d2d38537'
  };

  const onConfirmAddPrivateKey = () =>{
    const encryptPublicKey = inputRef.current?.value
    console.log(encryptPublicKey)
    if(encryptPublicKey){
      dispatch(setGuestKey(encryptPublicKey))
    }
    handleClose()
  }

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const recipients = participants.filter((participant) => (
    participant.id !== user.id
  ));
  const name = recipients.reduce((
    names: string[],
    participant
  ) => [...names, participant.name], []).join(', ');

  const handleMenuOpen = (): void => {
    setOpenMenu(true);
  };

  const handleMenuClose = (): void => {
    setOpenMenu(false);
  };

  const handleDecodeMessenger = (): void => {

  }

  return (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: 'background.paper',
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        display: 'flex',
        flexShrink: 0,
        minHeight: 64,
        px: 2,
        py: 1
      }}
      {...other}
    >
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={
          {
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }
        }>
          <Typography id="modal-modal-title"
            variant="h6"
            component="h2">
            Need Encrypt Public Key
          </Typography>
          <Typography id="modal-modal-description"
            sx={{ mt: 2 }}>
          </Typography>
          <Input placeholder="Encrypt Public key"
            inputRef={inputRef} />
          <Button onClick={onConfirmAddPrivateKey}>Confirm</Button>
        </Box>
      </Modal>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <AvatarGroup
          max={2}
          sx={{
            ...(recipients.length > 1 && {
              '& .MuiAvatar-root': {
                height: 30,
                width: 30,
                '&:nth-of-type(2)': {
                  mt: '10px'
                }
              }
            })
          }}
        >
          {recipients.map((recipient) => (
            <Avatar
              key={recipient.id}
              src={recipient.avatar || undefined}
            />
          ))}
        </AvatarGroup>
        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle2">
            {name}
          </Typography>
          {Boolean(recipients.length === 1 && recipients[0].lastActivity) && (
            <Typography
              color="textSecondary"
              variant="caption"
            >
              Last active
              {' '}
              {formatDistanceToNowStrict(recipients[0].lastActivity!, { addSuffix: true })}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Button onClick={handleOpen}>Encrypt Message</Button>
      <IconButton >
        <PhoneIcon fontSize="small" />
      </IconButton>
      <IconButton>
        <CameraIcon fontSize="small" />
      </IconButton>
      <Tooltip title="More options">
        <IconButton
          onClick={handleMenuOpen}
          ref={moreRef}
        >
          <DotsHorizontalIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={moreRef.current}
        keepMounted
        onClose={handleMenuClose}
        open={openMenu}
      >
        <MenuItem>
          <ListItemIcon>
            <BanIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Block contact" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <TrashIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete thread" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Archive thread" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <BellIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mute notifications" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

ChatThreadToolbar.propTypes = {
  // @ts-ignore
  participants: PropTypes.array
};

ChatThreadToolbar.defaultProps = {
  participants: []
};
