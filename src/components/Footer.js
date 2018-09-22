import React from 'react';
import {Container} from 'reactstrap';

const Footer = (props) => (
  <footer className='footer'>
      <Container>
        <span>
          Tensorflow model trained using the dataset from&nbsp;
          <a 
            target='_blank'
            rel='noopener noreferrer'
            href='https://link.springer.com/chapter/10.1007/978-3-319-10590-1_39'
          >
          "Architectural Style Classification using Multinomial Latent Logistic Regression" (ECCV2014)
          </a>.&nbsp;
          For more information about the dataset, contact&nbsp;
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://sites.google.com/site/zhexuutssjtu/home'
          >
          Zhe Xu
          </a>.
        </span>
      </Container>
  </footer>
)

export default Footer;