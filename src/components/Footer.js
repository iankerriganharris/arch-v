import React from 'react';
import {Container} from 'reactstrap';

const fullText = (
  <span className='full-footer-text'>
    <a
    target='_blank'
    rel='noopener noreferrer'
    href='https://link.springer.com/chapter/10.1007/978-3-319-10590-1_39'
    >
    Dataset&nbsp;
    </a>
    |&nbsp;
    <a
    target='_blank'
    rel='noopener noreferrer'
    href='https://github.com/iankerriganharris/arch-v'
    >
    Github
    </a>
  </span>
)

const shortText = (
  <span className='short-footer-text'>
    <a
    target='_blank'
    rel='noopener noreferrer'
    href='https://link.springer.com/chapter/10.1007/978-3-319-10590-1_39'
    >
    Dataset&nbsp;
    </a>
    |&nbsp;
    <a
    target='_blank'
    rel='noopener noreferrer'
    href='https://github.com/iankerriganharris/arch-v'
    >
    Github
    </a>
  </span>
)

const Footer = (props) => (
  <footer className='footer'>
      <Container>
        {fullText}
        {shortText}
      </Container>
  </footer>
)

export default Footer;