import React from 'react'
import Account from '../Host/Account/Account'
import HostNav from '../Host/Navbar/HostNav'
import SecondSection from '../Host/Herosection/SecondSection'

const AccountPage = () => {
  return (
    <>
    <HostNav/>
    <SecondSection activeTab="Account"/>
    <Account/>
    </>
  )
}

export default AccountPage