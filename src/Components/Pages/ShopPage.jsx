import React from 'react'
import Shop from '../Host/Shop/Shop'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import HostNav from '../Host/Navbar/HostNav'
import SecondSection from '../Host/Herosection/SecondSection'

const ShopPage = () => {
  return (
    <>
        <HostNav/>
        <SecondSection activeTab="Shop" />
      <Shop/>
    </>
  )
}

export default ShopPage