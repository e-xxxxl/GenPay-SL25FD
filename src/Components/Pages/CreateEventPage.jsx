import React from 'react'
import HostNav from '../Host/Navbar/HostNav'
import SecondSection from '../Host/Herosection/SecondSection'
import CreateEvent from '../Host/Event/CreateEvent'

const CreateEventPage = () => {
  return (
    <>
    <HostNav/>
    <SecondSection activeTab='Event'/>
    <CreateEvent/>
    
    </>
  )
}

export default CreateEventPage