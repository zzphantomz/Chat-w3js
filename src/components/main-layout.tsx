import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { MainNavbar } from './main-navbar';
import { MainSidebar } from './main-sidebar';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayoutRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 64
  })
);

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  return (
    <MainLayoutRoot>
      <MainSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      />
      {children}
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};
