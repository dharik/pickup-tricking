import React, { Component } from "react";
import Checkbox from "material-ui/Checkbox";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import DatePicker from "material-ui/DatePicker";
import TimePicker from "material-ui/TimePicker";
import TextField from "material-ui/TextField";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import SearchBox from "react-google-maps/lib/places/SearchBox";

const weekdays = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays"
];

const apiKeyParams = {
  key: "AIzaSyBUoa5u8pUE5UayWD-QL7Ff8gNQUSaVU84"
};

const INPUT_STYLE = {
  boxSizing: `border-box`,
  MozBoxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  marginTop: `27px`,
  padding: `0 12px`,
  borderRadius: `1px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`
};

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={10}
    defaultCenter={props.defaultCenter}
    onClick={props.onMapClick}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      inputPlaceholder="Enter an address"
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
      inputStyle={INPUT_STYLE}
    />
    <Marker position={props.marker} key="Test" defaultAnimation={2} />
  </GoogleMap>
));

class HostGathering extends Component {
  state = {
    isSpringFloor: false,
    isGrass: false,
    frequency: "weekly",
    weekly_days: ["Saturdays", "Fridays"],
    selectedLocation: {
      lat: this.props.center.lat,
      lng: this.props.center.lng
    }
  };

  stepOne() {
    return (
      <div>
        <Checkbox
          checked={this.state.isSpringFloor}
          onCheck={(event, b) => this.setState({ isSpringFloor: b })}
          label="Spring floors"
        />
        <Checkbox
          checked={this.state.isGrass}
          onCheck={(event, b) => this.setState({ isGrass: b })}
          label="Grass"
        />

        <GettingStartedGoogleMap
          containerElement={<div style={{ width: "100%", height: "400px" }} />}
          mapElement={<div style={{ height: `100%` }} />}
          defaultCenter={this.props.center}
          marker={this.state.selectedLocation}
          onPlacesChanged={() => this.searchPlaces()}
          onSearchBoxMounted={box => this._searchBox = box}
          onMapClick={event =>
            this.setState({
              selectedLocation: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              }
            })}
        />
      </div>
    );
  }

  searchPlaces() {
    this._searchBox.getPlaces() && this.setState({
      selectedLocation: this._searchBox.getPlaces()[0].geometry.location
    });
  }

  selectLocation({ x, y, lat, lng, event }) {
    console.info("Selected", lat, lng);
  }
  
  stepTwo() {
    return (
      <div>
        How often does this gathering occur?

        <RadioButtonGroup
          name="frequency"
          defaultSelected="weekly"
          onChange={(event, newFrequency) =>
            this.setState({ frequency: newFrequency })}
        >
          <RadioButton value="once" label="Just once" />
          <RadioButton value="weekly" label="Weekly" />
          <RadioButton value="other" label="Other" />
        </RadioButtonGroup>

        {this.state.frequency === "once" &&
          <DatePicker hintText="What date?" />}
        {this.state.frequency === "once" &&
          <TimePicker hintText="At what time?" minutesStep={10} />}

        {this.state.frequency === "weekly" &&
          <SelectField
            multiple={true}
            hintText="Which days?"
            value={this.state.weekly_days}
            onChange={(event, index, values) =>
              this.setState({ weekly_days: values })}
          >
            {this.menuItems(this.state.weekly_days)}
          </SelectField>}

        {this.state.frequency === "other" &&
          "You can specify a schedule in the last step"}
      </div>
    );
  }

  stepThree() {
    return (
      <div>
        <TextField
          hintText="Give your gathering a title"
          floatingLabelText="Gathering name"
          floatingLabelFixed={true}
        />

        <TextField
          floatingLabelFixed
          floatingLabelText="URL"
          hintText="Facebook, Meetup.com, whatever"
        />

        <TextField
          multiLine
          floatingLabelText="Details"
          floatingLabelFixed
          hintText="Be specific about when to meet, what to look for, what to bring, etc. Add information about how to contact you if necessary -- for example, a phone number or instagram handle"
        />

      </div>
    );
  }

  render() {
    return this.stepOne();
  }

  menuItems() {
    return weekdays.map(day => (
      <MenuItem
        key={day}
        insetChildren={true}
        checked={this.state.weekly_days.indexOf(day) > -1}
        value={day}
        primaryText={day}
      />
    ));
  }
}

export default HostGathering;
