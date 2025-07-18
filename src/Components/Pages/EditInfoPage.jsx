import React from 'react'
import HostNav from '../Host/Navbar/HostNav'
import EditInfo from '../Host/Account/EditInfo'
import SecondSection from '../Host/Herosection/SecondSection'

const EditInfoPage = () => {
  return (
    <>
    
    <HostNav/>
    <SecondSection activeTab='Account'/>
    <EditInfo/>
    </>
  )
}

export default EditInfoPage