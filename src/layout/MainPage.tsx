import React, { useState } from 'react';

import settings from '../components/settings';
import '@polkadot/ui-app/i18n';
import '../components/utils/styles';

import dynamic from 'next/dynamic';
const Suspense = dynamic(() => import('../components/utils/Suspense'), { ssr: false });
import store from 'store';
import { getTypeRegistry } from '@polkadot/types';
import { Api } from '@polkadot/ui-api';

import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import Queue from '@polkadot/ui-app/Status/Queue';
import { registerSubsocialTypes } from '../components/types';
const Connecting = dynamic(() => import('../components/main/Connecting'), { ssr: false });
import Menu from './SideMenu';
import Signer from '../components/ui-signer';
import { MyAccountProvider } from '../components/utils/MyAccountContext';
import { QueueProps } from '@polkadot/ui-app/Status/types';
import Status from '../components/main/Status';
import { ReactiveBase } from '@appbaseio/reactivesearch';
import { AllElasticIndexes, ElasticNodeURL } from '../config/ElasticConfig';
import { Layout } from 'antd';
import TopMenu from './TopMenu';

const { Header, Sider, Content } = Layout;

type Props = {
  children: React.ReactNode
};

const SideMenu = (props: Props) => {
  const [ collapsed, setCollapsed ] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return <ReactiveBase
    url={ElasticNodeURL}
    app={AllElasticIndexes.join(',')}
  >
  <Layout style={{ minHeight: '100vh', backgroundColor: '#fafafa !important' }}>
    <Header className='DfHeader'>
      <TopMenu toggleCollapsed={toggleCollapsed}/>
    </Header>
    <Layout style={{ marginTop: '64px' }}>
      <Sider
        width={250}
        className='DfSider'
        trigger={null}
        collapsed={collapsed}
      >
        <Menu collapsed={collapsed}/>
      </Sider>
      <Layout style={{ padding: '0 24px 24px', marginLeft: collapsed ? '80px' : '250px' }}>
      <Content className='DfPageContent'>{props.children}</Content>
      </Layout>
    </Layout>
  </Layout>,
  </ReactiveBase>;
};

const NextLayout: React.FunctionComponent<any> = ({ children }) => {
  const url = process.env.WS_URL || settings.apiUrl || undefined;

  console.log('Web socket url=', url);

  try {
    registerSubsocialTypes();
    const types = store.get('types') || {};
    const names = Object.keys(types);

    if (names.length) {
      getTypeRegistry().register(types);
      console.log('Type registration:', names.join(', '));
    }
  } catch (error) {
    console.error('Type registration failed', error);
  }
  return <div id='root'>
    <Suspense fallback='...'>
      <Queue>
        <QueueConsumer>
          {({ queueExtrinsic, queueSetTxStatus }) => {
            return (
              <Api
                queueExtrinsic={queueExtrinsic}
                queueSetTxStatus={queueSetTxStatus}
                url={url}
              >
                <MyAccountProvider>
                  <Signer>
                    <SideMenu>
                        <QueueConsumer>
                          {({ queueAction, stqueue, txqueue }: QueueProps) => (
                            <>
                              {children}
                              <Status
                                queueAction={queueAction}
                                stqueue={stqueue}
                                txqueue={txqueue}
                              />
                            </>
                          )}
                        </QueueConsumer>
                    </SideMenu>
                  </Signer>
                </MyAccountProvider>
                <Connecting />
              </Api>
            );
          }}
        </QueueConsumer>
      </Queue>
    </Suspense>
  </div>;
};

export default NextLayout;
