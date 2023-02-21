import type {FC} from 'react';
import {ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import type {TFunction} from 'react-i18next';
import {useTranslation} from 'react-i18next';
import type {Theme} from '@mui/material';
import {Box, Divider, Drawer, Typography, useMediaQuery} from '@mui/material';
import {ChatAlt2 as ChatAlt2Icon} from '../../icons/chat-alt2';
import {Home as HomeIcon} from '../../icons/home';
import {Selector as SelectorIcon} from '../../icons/selector';
import {Logo} from '../logo';
import {Scrollbar} from '../scrollbar';
import {DashboardSidebarSection} from './dashboard-sidebar-section';
import {OrganizationPopover} from './organization-popover';

interface DashboardSidebarProps {
  onClose?: () => void;
  open?: boolean;
}

interface Item {
  title: string;
  children?: Item[];
  chip?: ReactNode;
  icon?: ReactNode;
  path?: string;
}

interface Section {
  title: string;
  items: Item[];
}

const getSections = (t: TFunction): Section[] => [
  {
    title: t('General'),
    items: [
      {
        title: t('Overview'),
        path: '/dashboard',
        icon: <HomeIcon fontSize="small" />
      },
    ]
  },
  {
    title: t('Apps'),
    items: [

      {
        title: t('Chat'),
        path: '/dashboard/chat',
        icon: <ChatAlt2Icon fontSize="small" />
      },

    ]
  },
];

export const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const lgUp = useMediaQuery(
    (theme: Theme) => theme.breakpoints.up('lg'),
    {
      noSsr: true
    }
  );
  const sections = useMemo(() => getSections(t), [t]);
  const organizationsRef = useRef<HTMLButtonElement | null>(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] = useState<boolean>(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(
    handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]
  );

  const handleOpenOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = (): void => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <div>
            <Box sx={{ p: 2, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <NextLink
                href="/"
                passHref
              >
                <a style ={{ flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42
                    }}
                  />

                </a>

              </NextLink>
              <Typography sx={{
                fontSize: '1.5rem',
                fontWeight: 700,
                lineHeight: 2.5,
                ml: 2,
                textTransform: 'uppercase'
              }}>
                Chat App
              </Typography>
            </Box>
          </div>
          <Divider
            sx={{
              borderColor: '#2D3748', // dark divider
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section}
              />
            ))}
          </Box>
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 0,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
