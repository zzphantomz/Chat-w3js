import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SettingsConsumer, SettingsProvider } from '@/contexts/settings-context';
import { Provider } from 'react-redux';
import {createTheme} from "@/theme";
import { ThemeProvider } from '@mui/material';
import {RTL} from "@/components/rtl";
import {SettingsButton} from "@/components/SettingsButton";
import Head from "next/head";
import {NextPage} from "next";
import {FC} from "react";
import '@/libs/i18n';
import {store} from "@/store";


type EnhancedAppProps = AppProps & {
  Component: NextPage;
}


const App:FC<EnhancedAppProps> = (props) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);
  return  (
    <>
      <Head>
        <title>
          Chat Demo
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <Provider store={store}>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => (
              <ThemeProvider theme={createTheme({
                direction: settings.direction,
                responsiveFontSizes: settings.responsiveFontSizes,
                mode: settings.theme}
              )}>
                <RTL direction={settings.direction}>
                  <SettingsButton />
                  { getLayout(<Component {...pageProps} />)}
                </RTL>
              </ThemeProvider>
            )}
          </SettingsConsumer>
        </SettingsProvider>
      </Provider>
    </>)
}

export default App
