import React from 'react'
import HostNav from '../Host/Navbar/HostNav'
import Footer from '../Footer/Footer'
import FirstSection from '../Host/Herosection/FirstSection'
import SecondSection from '../Host/Herosection/SecondSection'
import ThirdSection from '../Host/Herosection/ThirdSection'

const HostDashPage = () => {
  return (
    <>
    
    <HostNav/>
    <FirstSection/>
    <SecondSection activeTab="Event" />
    <ThirdSection/>
    </>
  )
}

export default HostDashPage