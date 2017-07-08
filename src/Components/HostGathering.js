import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import TextField from 'material-ui/TextField';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import SearchBox from 'react-google-maps/lib/places/SearchBox';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const weekdays = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays'
];

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

const HostGatheringMap = withGoogleMap(props =>
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
);

class HostGathering extends Component {
  state = {
    isSpringFloor: false,
    isGrass: false,
    frequency: 'weekly',
    weekly_days: ['Saturdays', 'Fridays'],
    selectedLocation: {
      lat: this.props.center.lat,
      lng: this.props.center.lng
    },
    selectedLocationHasChanged: false,
    date: null,
    time: null,
    stepIndex: 0,
    title: '',
    url: '',
    description: ''
  };

  stepOne() {
    return (
      <div style={{ flexDirection: 'row', height: '400px', display: 'flex' }}>
        <div style={{ flex: 1, order: 2, paddingLeft: '10px' }}>
          <h4>About this location</h4>
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
        </div>

        <HostGatheringMap
          containerElement={
            <div style={{ flex: 2, height: '100%', order: 1 }} />
          }
          mapElement={<div style={{ height: '100%' }} />}
          defaultCenter={this.props.center}
          marker={this.state.selectedLocation}
          onPlacesChanged={() => this.searchPlaces()}
          onSearchBoxMounted={box => (this._searchBox = box)}
          onMapClick={event =>
            this.setState({
              selectedLocationHasChanged: true,
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
    const places = this._searchBox.getPlaces();
    if (places && places.length > 0) {
      this.setState({
        selectedLocationHasChanged: true,
        selectedLocation: this._searchBox.getPlaces()[0].geometry.location
      });
    }
  }

  selectLocation({ x, y, lat, lng, event }) {
    console.info('Selected', lat, lng);
  }

  stepTwo() {
    return (
      <div>
        <h3>How often does this gathering occur?</h3>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flex: 1 }}>
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
          </div>

          <div style={{ flex: 2 }}>
            {this.state.frequency === 'once' &&
              <DatePicker
                hintText="What date?"
                onChange={(event, date) => this.setState({ date })}
                value={this.state.date}
              />}
            {this.state.frequency === 'once' &&
              <TimePicker
                hintText="At what time?"
                minutesStep={10}
                onChange={(event, time) => this.setState({ time })}
                value={this.state.date}
              />}
            {this.state.frequency === 'weekly' &&
              <SelectField
                multiple={true}
                hintText="Which days?"
                value={this.state.weekly_days}
                onChange={(event, index, values) =>
                  this.setState({ weekly_days: values })}
              >
                {this.menuItems(this.state.weekly_days)}
              </SelectField>}
            {this.state.frequency === 'other' &&
              'You can specify a schedule in the next step'}
          </div>
        </div>
      </div>
    );
  }

  getMergedDate() {
    if (this.state.date && this.state.time) {
      return new Date(
        this.state.date.toDateString() + ' ' + this.state.time.toTimeString()
      );
    } else if (this.state.date) {
      return this.state.date;
    } else if (this.state.time) {
      return this.state.time;
    } else {
      return null;
    }
  }

  stepThree() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          hintText="Give your gathering a title"
          floatingLabelText="Gathering name"
          value={this.state.title}
          onChange={(event, title) => this.setState({ title })}
          floatingLabelFixed={true}
        />

        <TextField
          floatingLabelFixed
          floatingLabelText="URL"
          value={this.state.url}
          onChange={(event, url) => this.setState({ url })}
          hintText="Facebook, Meetup.com, whatever"
        />

        <TextField
          multiLine
          floatingLabelText="Details"
          floatingLabelFixed
          value={this.state.description}
          onChange={(event, description) => this.setState({ description })}
          hintText="Be specific about when to meet, what to look for, what to bring, etc. Add information about how to contact you if necessary -- for example, a phone number or instagram handle"
        />
      </div>
    );
  }

  getStepContent() {
    switch (this.state.stepIndex) {
      default:
      case 0:
        return this.stepOne();

      case 1:
        return this.stepTwo();

      case 2:
        return this.stepThree();
    }
  }

  render() {
    return (
      <div>
        <Stepper
          activeStep={this.state.stepIndex}
          linear={false}
          orientation="horizontal"
        >
          <Step>
            <StepButton onTouchTap={() => this.setState({ stepIndex: 0 })}>
              Where
            </StepButton>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({ stepIndex: 1 })}>
              When
            </StepButton>
          </Step>
          <Step>
            <StepButton onTouchTap={() => this.setState({ stepIndex: 2 })}>
              Details
            </StepButton>
          </Step>
        </Stepper>
        {this.getStepContent()}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FlatButton
            label="Back"
            disabled={this.state.stepIndex === 0}
            onTouchTap={() => this.handlePrev()}
            style={{ marginRight: 12 }}
          />

          <RaisedButton
            label={this.state.stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={() => this.handleNext()}
          />
        </div>
      </div>
    );
  }

  handlePrev() {
    this.setState({
      stepIndex: this.state.stepIndex - 1
    });
  }
  handleNext() {
    if (this.state.stepIndex < 2) {
      this.setState({
        stepIndex: this.state.stepIndex + 1
      });
    } else {
      this.finish();
    }
  }

  finish() {
    let errors = [];

    if (this.state.frequency === 'once' && this.getMergedDate() == null) {
      errors.push('Select a date & time');
    }

    if (
      this.state.frequency === 'weekly' &&
      this.state.weekly_days.length === 0
    ) {
      errors.push('Please select which days of the week you meet');
    }

    if (!this.state.selectedLocationHasChanged) {
      errors.push('Select a location');
    }

    if (this.state.title === '') {
      errors.push('Enter a title');
    }

    if (this.state.description.length < 7) {
      errors.push('Enter something useful in the description');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
    } else {
      alert('all good');
    }
  }

  menuItems() {
    return weekdays.map(day =>
      <MenuItem
        key={day}
        insetChildren={true}
        checked={this.state.weekly_days.indexOf(day) > -1}
        value={day}
        primaryText={day}
      />
    );
  }
}

export default HostGathering;
