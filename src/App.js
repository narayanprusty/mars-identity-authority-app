import React, { Component } from 'react';

import './App.css';
import "tabler-react/dist/Tabler.css";
import { 
  Grid, 
  Header, 
  Tab, 
  TabbedCard, 
  Form, 
  Button,
  Text,
  Card,
  Alert
} from "tabler-react";
import LaddaButton, { EXPAND_LEFT } from 'react-ladda';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {}

    this.issueIdentity = this.issueIdentity.bind(this);
  }

  issueIdentity = async (e) => {
    e.preventDefault()

    this.setState({
      loading: true
    })

    console.log(JSON.stringify({
      name: this.state.name,
      age: this.state.age,
      birthPlace: this.state.birthPlace
    }))

    let result = await (await fetch('http://ec2-52-90-174-194.compute-1.amazonaws.com:3000/createUser', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        age: this.state.age,
        birthPlace: this.state.birthPlace
      })
    })).json()

    if(!result.error) {
      this.setState({
        identityError: '',
        id: result.message.id,
        privateKey: result.message.privateKey
      })
    } else {
      this.setState({
        identityError: 'An error occured'
      })
    }

    this.setState({
      loading: false
    })
  }

  handleChanges = e => {
    this.setState({
        [e.target.name]: e.target.value,
    });
};

  render() {
    console.log(this)
    return (
      <Grid.Row>
        <Grid.Col className="mb-4" offset={3} width={6}>
          <Header.H1 className="mt-4">Identity Authority Dashboard</Header.H1>
          <Text style={{marginBottom: '20px'}}>You can issue an digital identity to every martian. The private key is stored in a chip associated with the issued card and a unique ID is printed on the card which can be shared as an identifier</Text>
          <Form onSubmit={this.issueIdentity} className="mb-4">
            <Form.Input name='name' label='Name' placeholder='Enter Name' onChange={this.handleChanges} />
            <Form.Input name='age' label='Age' placeholder='Enter Age' onChange={this.handleChanges} />
            <Form.Input name='birthPlace' label='Birth Place' placeholder='Enter Birth Place' onChange={this.handleChanges} />
            {this.state.identityError &&
              <Alert type="danger">
                {this.state.identityError}
              </Alert>
            }
            <LaddaButton
              loading={this.state.loading}
              type="submit"
              data-style={EXPAND_LEFT}
              className="btn btn-primary"
            >
              Issue
            </LaddaButton>
          </Form>
          {this.state.id &&
            <Card
              statusColor="purple"
              title={'ID: ' + this.state.id}
              body={'Private Key: ' + this.state.privateKey}
            />
          }
        </Grid.Col>
      </Grid.Row>
    );
  }
}

export default App;
