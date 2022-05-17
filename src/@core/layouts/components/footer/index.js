// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-left d-block d-md-inline-block mt-25'>
        © {new Date().getFullYear()}
         &nbsp; SiiA Group - powered by a4appz Limited. Member of SiiA Group 
      </span>
      <span className='float-md-right d-none d-md-block'>
        Dev Site - Version # 1.0 (V1.0)
      </span>
    </p>
  )
}

export default Footer
