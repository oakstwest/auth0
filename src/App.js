import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

class App extends Component {
constructor(props){
  super(props);
  this.state = {
    user:{}
  }
}


async componentDidMount(){
 let userData = await axios.get('/api/user-data');
 this.setState({
   user:userData.data
 });

}

  login(){
    let{REACT_APP_DOMAIN, REACT_APP_CLIENT_ID} =process.env;
let url =`${encodeURIComponent(window.location.origin)}/auth/callback`;

    window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${url}&response_type=code`
    }
  render() {
    return (
      < div className="App">
       <h1>My Auth Intro</h1>
       <button onClick = {() => this.login()}> Login </button>
       <a href = 'http://localhost:3005/logout'>
      
         <button>Logout</button>
         </a>
         <hr/>
         {JSON.stringify(this.state.user)}
      </div>
    );
  }
}

export default App;
