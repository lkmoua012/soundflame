import React, { Component } from 'react';
import { Container, Form, FormGroup, Label, Input, Button } from 'reactstrap';
require("dotenv").config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "Every Breath You Take",
      searchType: "track",
      searchResults: [],
      spotlight: [],
      response: '',
      post: '',
      responseToPost: '',
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
    const result = await response.text();

    console.log(result);
    this.setState({ responseToPost: body });
  };

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
          <p>
            {this.state.response}
          </p>

          <p>
            {this.state.responseToPost}
          </p>

        </Container>
      </Container>
    );
  }
}

export default App;
