import "promise-polyfill/src/polyfill";
import "whatwg-fetch";

import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { Router, Link, navigate } from "@reach/router";

import Form from "./modules/form/container/form.jsx";
import SignIn from "./modules/form/container/signin.jsx";

import DrinkList from "./modules/list/container/drinkList.jsx";

import NotFound from "./modules/notfound/404.jsx";

import { API_SERVER_URI, API_GETS, LOGIN_SERVER_URI } from "./config";

class App extends Component {
  constructor() {
    super();
    this.state = {
      submitData: {
        beer: [],
        location: [],
        user: []
      },
      list: {
        all: []
      },
      token: "",
      loading: true
    };
  }

  componentDidMount() {
    let promises = API_GETS.map(endpoint =>
      fetch(`${API_SERVER_URI}${endpoint}`).then(response => response.json())
    );

    Promise.all(promises)
      .then(dataArray => {
        let submitData = {};
        let list = {};
        API_GETS.forEach((endpoint, i) => {
          if (endpoint === "drink") {
            list.all = dataArray[i];
            return;
          }
          submitData[endpoint] = dataArray[i];
        });
        this.setState({ loading: false, submitData, list });
      })
      .catch(err => {
        this.setState({ loading: false });
        console.error(err);
      });
  }

  // need to update list eventually
  addDrink = data => {
    if (!this.state.token.length) return console.error("no token provided");
    fetch(`${API_SERVER_URI}drink`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({ data })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(data => console.log({ data }, "set"))
      .then(() => navigate("/all"))
      .catch(err => console.error(err));
  };

  login = data => {
    if (!data.username || !data.password) return;
    fetch(`${LOGIN_SERVER_URI}`, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data })
    })
      .then(handleErrors)
      .then(response => response.json())
      .then(data =>
        this.setState({ token: data.token }, () => {
          navigate("/");
        })
      )
      .catch(err => console.error(err));
  };

  render() {
    let { beer, user } = this.state.submitData;
    let { all } = this.state.list;
    let { token, loading } = this.state;
    let locations = this.state.submitData.location;

    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <Link className="navbar-brand btn btn-link" to="/">
            Home
          </Link>
          <Link className="navbar-brand btn btn-link" to="/signin">
            Sign In
          </Link>
          <Link className="navbar-brand btn btn-link" to="/all">
            All
          </Link>
        </nav>
        <main role="main" className="container mt-5">
          <div className="row">
            <div className="col-md-12 mt-5">
              {loading ? null : (
                <Router>
                  <Form
                    path="/"
                    beer={beer}
                    user={user}
                    locations={locations}
                    handleSubmit={this.addDrink}
                  />
                  <SignIn path="/signin" handleSubmit={this.login} />
                  <DrinkList path="/all" drinks={all} />
                  <NotFound default />
                </Router>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export default hot(module)(App);
