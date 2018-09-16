import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';


const handleClick = () => {
  document.getElementById('hiddenInput').click()
}

const handleInputFile = (e, destinationHandler) => {
  if(e.target.files && e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      destinationHandler(e.target.result)
    }
    reader.readAsDataURL(e.target.files[0])
  }
}

const UploadButton = (props) => {
  return(
    <div>
      <input 
        type="file" 
        id='hiddenInput' 
        className='hidden' 
        onChange={(e) => handleInputFile(e, props.destinationHandler)}
      />
      <Button color='primary' active={false} onClick={handleClick}>Upload</Button>
    </div>

  )
}

UploadButton.propTypes = {
  destinationHandler: PropTypes.func.isRequired
}

export default UploadButton;