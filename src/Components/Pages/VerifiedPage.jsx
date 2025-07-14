import React from 'react'
import Navbar from '../Navbar/Navbar'
import Verified from '../Auth/EmailVerification/Verified'
import Footer from '../Footer/Footer'

const VerifiedPage = () => {
  return (
    <>
      <Navbar/>
      <Verified/>
      <Footer/>
    </>
  )
}

export default VerifiedPage