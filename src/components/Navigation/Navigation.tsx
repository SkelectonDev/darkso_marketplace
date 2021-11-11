import React from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { Link } from 'react-router-dom'
import { Tabs } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
//import { ProviderType } from 'decentraland-connect';
import { locations } from '../../modules/routing/locations'
import { Props, NavigationTab } from './Navigation.types'
import { useEagerConnect, useInactiveListener } from '../../modules/wallet/hook'
import { injected } from '../../modules/wallet/connectors'

import './Navigation.css'

const Navigation = (props: Props) => {
  const { activeTab } = props

  // const handleOnSignIn = useCallback(() => {
  //   onNavigate(locations.signIn())
  // }, [onNavigate])

  // const handleOnClickAccount = useCallback(() => {
  //   onNavigate(locations.account())
  // }, [onNavigate])

  const context = useWeb3React<Web3Provider>()
  //const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const { connector, activate } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  const currentConnector = injected
  //const activating = currentConnector === activatingConnector
  const connected = currentConnector === connector
  //const disabled = !triedEager || !!activatingConnector || connected || !!error

  

  const handleConnect = () => {
    setActivatingConnector(currentConnector)
    activate(currentConnector)
  }

  return (
    <Tabs>
      <Tabs.Left>
        <Link to={locations.dashboard()}>
          <Tabs.Tab active={activeTab === NavigationTab.DASH}>
            {t('nav.dashboard')}
          </Tabs.Tab>
        </Link>
        <Link to={locations.market()}>
          <Tabs.Tab active={activeTab === NavigationTab.MARKET}>
            {t('nav.marketplace')}
          </Tabs.Tab>
        </Link>
        <Link to={locations.train()}>
          <Tabs.Tab active={activeTab === NavigationTab.TRAIN}>
            {t('nav.training')}
          </Tabs.Tab>
        </Link>
        <Link to={locations.pack()}>
          <Tabs.Tab active={activeTab === NavigationTab.PACK}>
            {t('nav.packs')}
          </Tabs.Tab>
        </Link>

        {/* <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
          <Link to={locations.activity()}>
            <Tabs.Tab active={activeTab === NavigationTab.ACTIVITY}>
              {t('navigation.activity')}
            </Tabs.Tab>
          </Link>
        </Responsive> */}
      </Tabs.Left>
      <Tabs.Right>
        {connected?(
          <Link to={locations.account()}>
              <Tabs.Tab>
                {t('nav.account')}
              </Tabs.Tab>  
          </Link>
          
        ):(
          <Tabs.Tab>
            <a onClick={handleConnect}>
              {t('nav.signin')}
            </a>
          </Tabs.Tab>
        )}
      </Tabs.Right>
    </Tabs>
  )
}

export default React.memo(Navigation)
