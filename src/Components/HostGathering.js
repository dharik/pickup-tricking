import React, { Component } from "react";
import Checkbox from "material-ui/Checkbox";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import DatePicker from "material-ui/DatePicker";
import TimePicker from "material-ui/TimePicker";
import TextField from "material-ui/TextField";
import GoogleMapReact from "google-map-react";

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

const SelectedLocation = ({text, lat, lng}) => {
  return <div>{text}</div>;
}

class HostGathering extends Component {
  state = {
    isSpringFloor: false,
    isGrass: false,
    frequency: "weekly",
    weekly_days: ["Saturdays", "Fridays"],
    selectedLocation: {
      id: "A",
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

        <div style={{ width: "100%", height: "400px" }}>
          <GoogleMapReact
            bootstrapURLKeys={apiKeyParams}
            center={this.props.center}
            defaultZoom={10}
            onClick={this.selectLocation}
          >
            <SelectedLocation  
              text="Test"
              lat={this.state.selectedLocation.lat}
              lng={this.state.selectedLocation.lng}
            />
          </GoogleMapReact>
        </div>
        Host Gathering!
      </div>
    );
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
