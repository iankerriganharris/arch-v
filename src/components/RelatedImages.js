import React, {Component} from 'react';
import { Row, Col, Fade } from 'reactstrap';

class RelatedImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileNames: [],
      fileUrls: []
    };
  }

  componentDidMount = () => {
    this.getFileNames(this.props.activeLabel)
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeLabel } = this.props;
    if(prevProps.activeLabel !== activeLabel) {
      this.setState({...this.state, fileUrls: []}, () => this.getFileNames(activeLabel))
    }

    const { fileNames } = this.state;
    if(prevState.fileNames !== fileNames && Array.isArray(fileNames) && fileNames.length) {
        fileNames.forEach((v) => this.getImageUrls(v))
    }
  }

  getFileNames = async (activeLabel) => {
    const encodedSearchTerm = encodeURIComponent(activeLabel)
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedSearchTerm}&prop=images&format=json&origin=*`
        )
      const data = await response.json()
      const pageId = Object.keys(data.query.pages)[0]
      const fileNames = data.query.pages[pageId].images.slice(0,3).map((v, i) => v.title)
      this.setState({fileNames: fileNames})
    } catch(error) {
      console.log(error)
    }
  }

  getImageUrls = async (fileName) => {
    const encodedSearchTerm = encodeURIComponent(fileName);
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedSearchTerm}&prop=imageinfo&iiprop=url&iiurlwidth=220&format=json&origin=*`
      )
    const data = await response.json()
    const pageId = Object.keys(data.query.pages)[0]
    const url = data.query.pages[pageId].imageinfo[0].thumburl
    this.setState({...this.state, fileUrls: [...this.state.fileUrls, url]})
  }

  render() {
    const { fileUrls } = this.state
    const haveAllUrls = fileUrls ? true : false;
    return(
      <Fade in={haveAllUrls}>
      <Row className='img-row'>
        <Col>
          <ul>
          {fileUrls.map((url, i) => <li key={i}><img className='related-img' src={url} alt='' /></li>)}
          </ul>
        </Col>
      </Row>
      </Fade>
    )
  }
}

export default RelatedImages;