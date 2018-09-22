import React, {Component} from 'react';
import { Row, Col } from 'reactstrap';

class RelatedImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileNames: [],
      fileUrls: []
    };
  }

  componentDidMount = () => {
    this.getImageNames()
  }

  componentDidUpdate(prevProps, prevState) {
    const { fileNames } = this.state;
    if(prevState.fileNames !== fileNames && Array.isArray(fileNames) && fileNames.length) {
      fileNames.forEach((v) => this.getImageUrls(v))
    }
  }

  getImageNames = async () => {
    const response = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&titles=Art_Deco&prop=images&format=json&origin=*'
      )
    const data = await response.json()
    const pageId = Object.keys(data.query.pages)[0]
    const fileNames = data.query.pages[pageId].images.slice(0,5).map((v, i) => v.title)
    this.setState({fileNames: fileNames})
  }

  getImageUrls = async (fileName) => {
    const encodedFileName = encodeURIComponent(fileName);
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedFileName}&prop=imageinfo&iiprop=url&iiurlwidth=220&format=json&origin=*`
      )
    const data = await response.json()
    console.log(data)
    const pageId = Object.keys(data.query.pages)[0]
    const url = data.query.pages[pageId].imageinfo[0].thumburl
    this.setState({...this.state, fileUrls: [...this.state.fileUrls, url]})
  }

  render() {
    const { fileUrls } = this.state
    return(
      <Row>
        {fileUrls.map((url, i) => <Col><img  src={url} alt='' /></Col>)}
      </Row>
    )
  }
}

export default RelatedImages;