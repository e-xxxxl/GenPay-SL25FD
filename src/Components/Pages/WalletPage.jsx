import React from 'react'
import Account from '../Host/Account/Account'
import HostNav from '../Host/Navbar/HostNav'
import SecondSection from '../Host/Herosection/SecondSection'
import Wallett from '../Host/Account/Wallett'

const AccountPage = () => {
  return (
    <>
    <HostNav/>
    <SecondSection activeTab="Wallet"/>
    <Wallett/>
    </>
  )
}

export default AccountPage