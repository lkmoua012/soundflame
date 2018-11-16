import React, { Component } from 'react';
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Jumbotron,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from 'reactstrap';
import axios from 'axios';

import ReactPlayer from 'react-player';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {

      data: [],
      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate: null,
      objectToUpdate: null,

      searchTerm: "Thriller",
      searchType: "track",
      response: '',
      post: '',
      responseToPost: '',

      result1artist: '',
      result1album: '',
      result1songTitle: '',
      result1previewLink: '',
      result1thirty: '',
      result1exp: '',

      result2artist: '',
      result2album: '',
      result2songTitle: '',
      result2previewLink: '',
      result2thirty: '',
      result2exp: '',

      result3artist: '',
      result3album: '',
      result3songTitle: '',
      result3previewLink: '',
      result3thirty: '',
      result3exp: ''

    };
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  };

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  };

  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  putDataToDb = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id === idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id === idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

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

    if (body === "null") {
      this.clearResults();
    } else {
      var jBody = JSON.parse(body);

      this.setState({ responseToPost: body });

      this.setState({ result1artist: jBody.artist1 });
      this.setState({ result1album: jBody.album1 });
      this.setState({ result1songTitle: jBody.songTitle1 });
      this.setState({ result1previewLink: jBody.previewLink1 });
      this.setState({ result1thirty: jBody.thirty1 });
      this.setState({ result1albumImg: jBody.albumImg1 });

      this.setState({ result2artist: jBody.artist2 });
      this.setState({ result2album: jBody.album2 });
      this.setState({ result2songTitle: jBody.songTitle2 });
      this.setState({ result2previewLink: jBody.previewLink2 });
      this.setState({ result2thirty: jBody.thirty2 });
      this.setState({ result2albumImg: jBody.albumImg2 });

      this.setState({ result3artist: jBody.artist3 });
      this.setState({ result3album: jBody.album3 });
      this.setState({ result3songTitle: jBody.songTitle3 });
      this.setState({ result3previewLink: jBody.previewLink3 });
      this.setState({ result3thirty: jBody.thirty3 });
      this.setState({ result3albumImg: jBody.albumImg3 });

      console.log(jBody.exp1);
      console.log(this.state.result1exp);

      if (jBody.exp1 === "true") {
        this.setState({ result1exp: '(Explicit)' });
      };

      if (jBody.exp2 === "true") {
        this.setState({ result2exp: '(Explicit)' });
      };

      if (jBody.exp3 === "true") {
        this.setState({ result3exp: '(Explicit)' });
      };

    }
  };

  clearResults() {
    this.setState({ result1artist: "Unfortunately, a preview for this song is unavailable." });
    this.setState({ result1album: '' });
    this.setState({ result1songTitle: '' });
    this.setState({ result1previewLink: '' });
    this.setState({ result1thirty: '' });
    this.setState({ result1albumImg: '' });

    this.setState({ result2artist: '' })
    this.setState({ result2album: '' });
    this.setState({ result2songTitle: '' });
    this.setState({ result2previewLink: '' });
    this.setState({ result2thirty: '' });
    this.setState({ result2albumImg: '' });

    this.setState({ result3artist: '' })
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
    const { data } = this.state;
    return (
      <Container>
        <Jumbotron>
          <h2>Welcome to Soundflame <i class="fas fa-music"></i> <i class="fas fa-fire"></i></h2>
        </Jumbotron>
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
              <Card>
                <CardImg top width="75%" src={this.state.result1albumImg} alt='' style={{ height: 300 }} />
                <CardBody>
                  <CardTitle>{this.state.result1songTitle}{this.state.result1exp}</CardTitle>
                  <CardSubtitle>
                    {this.state.result1artist}
                    <br />
                    {this.state.result1album}
                  </CardSubtitle>
                  <CardText>
                    {this.state.result1previewLink}
                    <ReactPlayer
                      className='react-player'
                      url={this.state.result1thirty}
                      width='100%'
                      height='50px'
                      controls />
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm="4">
              <Card>
                <CardImg top width="75%" src={this.state.result2albumImg} alt='' style={{ height: 300 }} />
                <CardBody>
                  <CardTitle>{this.state.result2songTitle}{this.state.result2exp}</CardTitle>
                  <CardSubtitle>
                    {this.state.result2artist}
                    <br />
                    {this.state.result2album}
                  </CardSubtitle>
                  <CardText>
                    {this.state.result2previewLink}
                    <ReactPlayer
                      className='react-player'
                      url={this.state.result2thirty}
                      width='100%'
                      height='50px'
                      controls />
                  </CardText>
                </CardBody>
              </Card>
            </Col>
            <Col sm="4">
              <Card>
                <CardImg top width="75%" src={this.state.result3albumImg} alt='' style={{ height: 300 }} />
                <CardBody>
                  <CardTitle>{this.state.result3songTitle}{this.state.result3exp}</CardTitle>
                  <CardSubtitle>
                    {this.state.result3artist}
                    <br />
                    {this.state.result3album}
                  </CardSubtitle>
                  <CardText>
                    {this.state.result3previewLink}
                    <ReactPlayer
                      className='react-player'
                      url={this.state.result3thirty}
                      width='100%'
                      height='50px'
                      controls />
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>

        <div>
          <h3>Saved Songs</h3>
          <ul>
            {data.length <= 0
              ? "No songs yet saved."
              : data.map(dat => (
                <li style={{ padding: "10px" }} key={data.message}>
                  <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
                  <span style={{ color: "gray" }}> data: </span>
                  {dat.message}
                </li>
              ))}
          </ul>
          <div style={{ padding: "10px" }}>
            <button onClick={() => this.putDataToDb(
              "\nSong: " + this.state.result1songTitle +
              " ---\nArtist: " + this.state.result1artist +
              " ---\nAlbum: " + this.state.result1album)}>
              SAVE 1
          </button>
          <button onClick={() => this.putDataToDb(
              "\nSong: " + this.state.result2songTitle +
              " ---\nArtist: " + this.state.result2artist +
              " ---\nAlbum: " + this.state.result2album)}>
              SAVE 2
          </button>
          <button onClick={() => this.putDataToDb(
              "\nSong: " + this.state.result3songTitle +
              " ---\nArtist: " + this.state.result3artist +
              " ---\nAlbum: " + this.state.result3album)}>
              SAVE 3
          </button>
          </div>
          <div style={{ padding: "10px" }}>
            <input
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ idToDelete: e.target.value })}
              placeholder="put id of item to delete here"
            />
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE
          </button>
          </div>
        </div>

      </Container>

    );
  }
}

export default App;
