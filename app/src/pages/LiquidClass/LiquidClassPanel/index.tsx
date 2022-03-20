import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { SidePanel,ListItem, Icon } from '@opentrons/components'

import { LIQUIDCLASS } from '../../../redux/nav'
import styles from '../../More/MorePanel/styles.css'

export function LiquidClassPanel():JSX.Element{
    const {t} = useTranslation('more_panel')
const ITEMS = [
    {label: t('Test the Liquid on Robot'), url:'/no_significance_1'},
    {label: t('Function2'), url:'/no_sig_2'},
    {label: t('F3'), url:'/no_sig2'}
]

return (
    <SidePanel title={LIQUIDCLASS}>
        <div className={styles.menu_panel}>
            <ol className={styles.menu_list}>
                {ITEMS.map(item=> (
                    <ListItem
                    key={item.url}
                    url={item.url}
                    className={styles.menu_item}
                    activeClassName = {styles.active}>
                    <span>{item.label}</span>
                    <Icon name = "check" className = {styles.menu_icon}/>
                    </ListItem>
                ))
                }
            </ol>
        </div>
    </SidePanel>
)
}