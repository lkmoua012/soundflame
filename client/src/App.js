import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import ReactPlayer from 'react-player';

require("dotenv").config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "Thriller",
      searchType: "track",
      searchResults: [],
      spotlight: [],
      response: '',
      post: '',
      responseToPost: '',

      result1artist: '',
      result1album: '',
      result1songTitle: '',
      result1previewLink: '',
      result1thirty: '',

      result2artist: '',
      result2album: '',
      result2songTitle: '',
      result2previewLink: '',
      result2thirty: '',

      result3artist: '',
      result3album: '',
      result3songTitle: '',
      result3previewLink: '',
      result3thirty: '',

    };
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  handleSubmit = async e => {
    e.preventDefault();

    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term: this.state.searchTerm,
        type: this.state.searchType
      }),
    });

    const body = await response.text();

    console.log(body);

    if (body === "null") {
      this.clearResults();
    } else {
      var jBody = JSON.parse(body);

      console.log(jBody);

      this.setState({ responseToPost: body });

      this.setState({ result1artist: 'Artist: ' + jBody.artist1 });
      this.setState({ result1album: 'Album: ' + jBody.album1 });
      this.setState({ result1songTitle: 'Song Title: ' + jBody.songTitle1 });
      this.setState({ result1previewLink: 'Song Link: ' + jBody.previewLink1 });
      this.setState({ result1thirty: jBody.thirty1 });
      this.setState({ result1albumImg: jBody.albumImg1 });

      this.setState({ result2artist: 'Artist: ' + jBody.artist2 });
      this.setState({ result2album: 'Album: ' + jBody.album2 });
      this.setState({ result2songTitle: 'Song Title: ' + jBody.songTitle2 });
      this.setState({ result2previewLink: 'Song Link: ' + jBody.previewLink2 });
      this.setState({ result2thirty: jBody.thirty2 });
      this.setState({ result2albumImg: jBody.albumImg2 });

      this.setState({ result3artist: 'Artist: ' + jBody.artist3 });
      this.setState({ result3album: 'Album: ' + jBody.album3 });
      this.setState({ result3songTitle: 'Song Title: ' + jBody.songTitle3 });
      this.setState({ result3previewLink: 'Song Link: ' + jBody.previewLink3 });
      this.setState({ result3thirty: jBody.thirty3 });
      this.setState({ result3albumImg: jBody.albumImg3 });

    }
  };

  clearResults() {
    this.setState({ result1artist: "Unfortunately, a preview for this song is unavailable." });
    this.setState({ result1album: '' });
    this.setState({ result1songTitle: '' });
    this.setState({ result1previewLink: '' });
    this.setState({ result1thirty: '' });
    this.setState({ result1albumImg: '' });

    this.setState({ result2artist: ''})
    this.setState({ result2album: '' });
    this.setState({ result2songTitle: '' });
    this.setState({ result2previewLink: '' });
    this.setState({ result2thirty: '' });
    this.setState({ result2albumImg: '' });

    this.setState({ result3artist: ''})
    this.setState({ result3album: '' });
    this.setState({ result3songTitle: '' });
    this.setState({ result3previewLink: '' });
    this.setState({ result3thirty: '' });
    this.setState({ result3albumImg: '' });
    
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    return (
      <Container>
        <h2>Welcome to Soundflame</h2>
        <Form>
          <FormGroup>
            <Label for="searchTerm">Search</Label>
            <Input
              value={this.state.searchTerm}
              onChange={this.handleInputChange}
              type="search"
              name="searchTerm"
              id="searchTerm"
              placeholder="Enter your search term." />
          </FormGroup>
          <FormGroup>
            <Label for="searchType">Filter</Label>
            <Input
              value={this.state.searchType}
              onChange={this.handleInputChange}
              type="select"
              name="searchType"
              id="searchType"
            >
              <option value="track">track</option>
              <option value="artist">artist</option>
              <option value="album">album</option>
            </Input>
          </FormGroup>
        </Form>
        <Button
          onClick={this.handleSubmit}
          color="primary"
          size="lg">Submit</Button>

        <Container>
          <h3>Results</h3>

          <Row>
            <Col sm="4">

              <div>
                <img src={this.state.result1albumImg} alt='' style={{ height: 150 }} />
              </div>

              <div>
                <p>
                  {this.state.result1artist}
                  <br />

                  {this.state.result1album}
                  <br />

                  {this.state.result1songTitle}
                  <br />

                  {this.state.result1previewLink}
                  <ReactPlayer
                  className='react-player'
                  url={this.state.result1thirty}
                  width= '100%'
                  height= '50px'
                  controls/>
                </p>
              </div>
            </Col>
            <Col sm="4">
              <div>
                <img src={this.state.result2albumImg} alt='' style={{ height: 150 }} />
              </div>

              <div>
                <p>
                  {this.state.result2artist}
                  <br />

                  {this.state.result2album}
                  <br />

                  {this.state.result2songTitle}
                  <br />

                  {this.state.result2previewLink}
                  <ReactPlayer
                  className='react-player'
                  url={this.state.result2thirty}
                  width= '100%'
                  height= '50px'
                  controls/>
                </p>
              </div>
            </Col>
            <Col sm="4">
              <div>
                <img src={this.state.result3albumImg} alt='' style={{ height: 150 }} />
              </div>

              <div>
                <p>
                  {this.state.result3artist}
                  <br />

                  {this.state.result3album}
                  <br />

                  {this.state.result3songTitle}
                  <br />

                  {this.state.result3previewLink}
                  <ReactPlayer
                  className='react-player'
                  url={this.state.result3thirty}
                  width= '100%'
                  height= '50px'
                  controls/>
                </p>
              </div>
            </Col>
          </Row>
        </Container>

      </Container>
    );
  }
}

export default App;
