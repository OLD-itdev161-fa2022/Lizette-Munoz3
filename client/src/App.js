import React from 'react';
import './App.css';
import axios from 'axios';
import {
  BrowserRouter as Router, Route,
  Routes,
  Link
} from "react-router-dom";
import Register from './componets/Register/Register';
import Login from './componets/Login/Login';

class App extends React.Component {
  state = {
    data: null,
    token: null,
    user: null
  }

  componentDidMount() {
    axios.get('http://localhost:5000')
    .then((response)  => {
      this.setState({
        data: response.data
      })    

   })
   .catch((error) => {
    console.error(`Error fetching data: ${error}`); 
  })

  this.authenticateUser();
}
  authenticateUser = () => {
    const token = localStorage.getItem('token');

  if(!token) {
    localStorage.removeItem('user')
    this.setState({ user: null });
  }
  if (token) {
    const config = {
      headers: {
        'x-auth-token': token
      }
    }
    axios.get('http://localhost:5000/api/auth', config)
    .then((response) => {
      localStorage.setItem('user', response.data.name)
      this.setState({ user: response.data.name })
    })
    .catch(error => {
      localStorage.removeItem('user');
      this.setState({ user: null });
      console.error(`Error logging in: ${error}`);

    })     
      
  }
}

logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.setState({ user: null, token: null });
}
  
  render() {
    let { user, data } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser
    };
    
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>GoodThings</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </header>
          <main>
            <Routes exact path="/">
              {this.state.data}
            </Routes>
            <Routes>
              <Route exact path ="/register" component = {Register}>
              Register
              </Route>
              <Route exact path="/login" component={Login}>
              login
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;