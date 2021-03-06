import React, { Component } from "react";
import Input from "../component/input.jsx";
import Select from "../component/select.jsx";
import Checkbox from "../component/checkbox.jsx";
import { API_SERVER_URI } from "../../../config";

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beer: props.beer.length ? props.beer[0] : {},
      user: props.user.length ? props.user[0] : {},
      locations: props.locations.length ? props.locations[0] : {},
      newLocation: false,
      newLocationName: "",
      newUser: false,
      newUserName: "",
      newBeer: false,
      newBeerName: "",
      newBreweryName: "",
      newBeerType: ""
    };
  }

  composeSubmitData() {
    let { newBeer, newLocation, newUser } = this.state;
    let data = {};

    data.location = !newLocation
      ? { _id: this.state.locations._id }
      : { name: this.state.newLocationName };

    data.user = !newUser
      ? { _id: this.state.user._id }
      : { name: this.state.newUserName };

    data.beer = !newBeer
      ? { _id: this.state.beer._id }
      : {
          name: this.state.newBeerName,
          brewery: this.state.newBreweryName,
          type: this.state.newBeerType
        };

    return data;
  }

  handleSelectChange = event => {
    let id = event.target.id;
    let item = this.props[id].find(item => {
      return event.target.value === item._id;
    });
    this.setState({ [id]: item });
  };

  handleCheckboxChange = event => {
    let id = event.target.id;
    let value = event.target.checked;
    this.setState({ [id]: value });
  };

  handleInputChange = event => {
    let id = event.target.id;
    let value = event.target.value;
    this.setState({ [id]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    let data = this.composeSubmitData();
    this.props.handleSubmit(data);
  };

  render() {
    let {
      beer,
      user,
      locations,
      newBeer,
      newLocation,
      newUser,
      newUserName,
      newBeerName,
      newBreweryName,
      newBeerType,
      newLocationName
    } = this.state;
    let availableBeers = this.props.beer;
    let availableUsers = this.props.user;
    let availableLocations = this.props.locations;

    return (
      <form id="form" onSubmit={this.handleSubmit}>
        <div className="row pt-2 pb-3">
          <div className="col-md-8">
            {!newUser ? (
              <Select
                text="User"
                id="user"
                options={availableUsers}
                value={user._id}
                onChange={this.handleSelectChange}
              />
            ) : (
              <Input
                text="enter"
                type="text"
                id="newUserName"
                label="Name"
                value={newUserName}
                onChange={this.handleInputChange}
              />
            )}
          </div>
          <div className="col-md-4">
            <Checkbox
              label="New Person?"
              text="newUser"
              id="newUser"
              value={newUser}
              onChange={this.handleCheckboxChange}
            />
          </div>
        </div>

        <div className="row pt-2 pb-3">
          <div className="col-md-8">
            {!newBeer ? (
              <Select
                text="Beer"
                id="beer"
                options={availableBeers}
                value={beer._id}
                onChange={this.handleSelectChange}
              />
            ) : (
              <>
                <Input
                  text="enter"
                  type="text"
                  id="newBeerName"
                  label="Name"
                  value={newBeerName}
                  onChange={this.handleInputChange}
                />
                <Input
                  text="enter"
                  type="text"
                  id="newBreweryName"
                  label="Brewery"
                  value={newBreweryName}
                  onChange={this.handleInputChange}
                />
                <Input
                  text="enter"
                  type="text"
                  id="newBeerType"
                  label="Type"
                  value={newBeerType}
                  onChange={this.handleInputChange}
                />
              </>
            )}
          </div>
          <div className="col-md-4">
            <Checkbox
              label="New Beer?"
              text="newBeer"
              id="newBeer"
              value={newBeer}
              onChange={this.handleCheckboxChange}
            />
          </div>
        </div>
        <div className="row pt-2 pb-3">
          <div className="col-md-8">
            {!newLocation ? (
              <Select
                text="Place"
                id="location"
                options={availableLocations}
                value={locations._id}
                onChange={this.handleSelectChange}
              />
            ) : (
              <Input
                text="enter"
                type="text"
                id="newLocationName"
                label="Place"
                value={newLocationName}
                onChange={this.handleInputChange}
              />
            )}
          </div>
          <div className="col-md-4">
            <Checkbox
              label="New Place?"
              text="newLocation"
              id="newLocation"
              value={newLocation}
              onChange={this.handleCheckboxChange}
            />
          </div>
        </div>

        <button className="btn btn-small btn-primary btn-block">Submit</button>
      </form>
    );
  }
}

export default FormContainer;
