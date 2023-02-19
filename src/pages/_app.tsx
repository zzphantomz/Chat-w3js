import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SettingsConsumer, SettingsProvider } from '@/contexts/settings-context';
import {createTheme} from "@/theme";
import { ThemeProvider } from '@mui/material';
import {RTL} from "@/components/rtl";


export default function App({ Component, pageProps }: AppProps) {
  return  (
    <SettingsProvider>
    <SettingsConsumer>
      {({ settings }) => (
        <ThemeProvider theme={createTheme({
          direction: settings.direction,
          responsiveFontSizes: settings.responsiveFontSizes,
          mode: settings.theme}
        )}>
            <RTL direction={settings.direction}>
              <Component {...pageProps} />
            </RTL>
          </ThemeProvider>
      )}
    </SettingsConsumer>
  </SettingsProvider>)
}
