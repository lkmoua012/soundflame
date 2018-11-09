import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
require("dotenv").config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "Toxic",
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
      resultthirty: '',

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
    this.setState({ result1artist: 'Artist: ' + jBody.artist });
    this.setState({ result1album: 'Album: ' + jBody.album });
    this.setState({ result1songTitle: 'Song Ttitle: ' + jBody.songTitle });
    this.setState({ result1previewLink: 'Preview Link: ' + jBody.previewLink });
    this.setState({ result1thirty: jBody.thirty });
    this.setState({ result1albumImg: jBody.albumImg });
    }
  };

  clearResults() {
    this.setState({ result1artist: "Unfortunately, a preview for this song is unavailable." });
    this.setState({ result1album: ''});
    this.setState({ result1songTitle: ''});
    this.setState({ result1previewLink: '' });
    this.setState({ result1thirty: ''});
    this.setState({ result1albumImg: '' });
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
          <div>
            <p>
              {this.state.response}
            </p>
          </div>

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

              <br />
              <a href={this.state.result1thirty}>Play the Song!</a>
            </p>
          </div>
        </Container>

      </Container>
    );
  }
}

export default App;
