import {useEffect} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {MainLayout} from '../components/main-layout';
import {gtm} from '../lib/gtm';
import {SettingsButton} from "../components/settings-button";

const Home: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          CHAT App
        </title>
      </Head>
      <main>
      </main>
    </>
  );
};

Home.getLayout = (page) => (
  <MainLayout>
    {page}
    <SettingsButton />
  </MainLayout>
);

export default Home;
