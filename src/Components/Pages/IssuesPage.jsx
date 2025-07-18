import React from 'react'
import Contact from '../Host/Issues/Contact'
import HostNav from '../Host/Navbar/HostNav'
import SecondSection from '../Host/Herosection/SecondSection'

const IssuesPage = () => {
  return (
    <>
        <HostNav/>
        <SecondSection activeTab='Report Issue'/>
        <Contact/>
    </>
  )
}

export default IssuesPage