import React from 'react';
import './App.css';
import UserDashboard from "./UserDashboard";
// import AdminDashboard from "/AdminDashboard";
import LoginRegisterForm from "./LoginRegisterForm";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      // checking to see if the user is a regular user 
      loggedInUser: null,
      // checking to see if user is the administrator
      isAdministrator: false, 
      submissions: []
    };
  }

  // create register route to be passed into the register component
  register = async registerInfo => {
    // we have to fetch this information in the route to our api 
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/api/v1/users/register",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(registerInfo),
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    const parsedLoginResponse = await response.json();

      if (response.ok) {
        this.setState({
          loggedIn: true,
          loggedInUser: parsedLoginResponse.data // array from flask 
        });
      } else {
        console.log(parsedLoginResponse);
      }
    }
  

  // create a route to login 
  login = async loginInfo => {
    const response = await fetch(
      // fetch the response from the API
      process.env.REACT_APP_API_URL + "/api/v1/users/login",
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(loginInfo),
        headers: {
          "Content-Type": "application/json"
        }
      }
    )

    const parsedLoginResponse = await response.json(); 
      if (parsedLoginResponse.status.code === 200) {
        this.setState({
          loggedIn: true, 
          loggedInUser: parsedLoginResponse.data // array from flask 
        })

      } else {
        console.log(parsedLoginResponse);
      }
    }

  userLogOut = async () => {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/api/v1/users/logout",
      {
        method: "GET",
        credentials: "include",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const parsedLoginResponse = await response.json();

    if (parsedLoginResponse.status.code === 200) {
      this.setState({
        loggedIn: false 
      });
    } else {
      console.log(parsedLoginResponse);
    }
  }

  seeSubmissions = async () => {
      try {
        console.log(this.state, "<- this is state")
        const submissions = await fetch(
          process.env.REACT_APP_API_URL + "/api/v1/submissions/dashboard/" + this.state.loggedInUser.id,
          { 
            credentials: "include" 
          }
        );
        const parsedSubmissions = await submissions.json();

        this.setState({
          submissions: parsedSubmissions.data

        });
      } catch (err) {
        console.log(err)

      }
    }

render() {
  const componentToRender = () => {
   if (this.state.loggedIn) {
      return (
        // if they are a User, bring them to the User dashboard
        <UserDashboard 
          loggedInUser={this.state.loggedInUser}
          userLogout={this.userLogOut}
          seeSubmissions={this.seeSubmissions}
          submissions={this.state.submissions}
          userLogout={this.state.userLogOut}
        />
      );
    } else {
      return (
        //bring them to the loginRegister form 
        <LoginRegisterForm login={this.login} register={this.register} />
      );
    }
  };
  return <div className="App">{componentToRender()}</div>;
};

}

export default App;
