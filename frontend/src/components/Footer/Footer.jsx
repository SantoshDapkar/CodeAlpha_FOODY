import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets';

// Import the FontAwesome component and the Instagram icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons'; // Instagram is a brand icon

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">

        <div className="footer-content-left">
          <img src={assets.logo2} alt="" />
          <p>"Skip the kitchen, not the quality. Foody is the ultimate destination for your next craving. Seamlessly explore a curated world of diverse cuisines, from neighborhood gems to gourmet excellence. Great food is just a tap away, delivered with care."</p>

          <div className="footer-social-icons">
            <a className='linked' href="https://www.linkedin.com/in/santosh-dapkar-508886277?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
            <img src={assets.twitter_icon} alt="Twitter" />
            <img src={assets.facebook_icon} alt="Facebook" />
          </div>
        </div>

        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>7447880764</li>
            <li>santoshdapkar7447@gmail.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className='footer-copyright'>Copyright 2025 Foody.com - All Rights Reserved.</p>
    </div>
  );
}

export default Footer;