import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { db, auth } from '../firebase';
import { Prompt } from 'react-router-dom';
import { Redirect, withRouter } from 'react-router-dom';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { ChevronRight } from 'react-feather';

const WEEK_DAYS = [
  'Sundays',
  'Mondays',
  'Tuesdays',
  'Wednesdays',
  'Thursdays',
  'Fridays',
  'Saturdays'
];

class HostGathering extends Component {
  state = {
    isSpringFloor: false,
    isGrass: false,
    hasCrashPads: false,
    isFree: false,
    frequency: 'weekly',
    weekly_days: ['Saturdays', 'Fridays'],
    selectedLocation: {
      lat: this.props.center.lat,
      lng: this.props.center.lng
    },
    selectedLocationHasChanged: false,
    date: null,
    title: '',
    url: '',
    description: '',
    done: false,
    placeId: null
  };

  render() {
    if (!auth.currentUser) {
      return <Redirect to={{ pathname: '/login', state: { from: '/host' } }} />;
    }

    if (this.state.done) {
      return (
        <div style={{ padding: '5px' }}>
          <h2>Success! Thank you for your contribution!</h2>
          <Redirect to="/browse" />
        </div>
      );
    }

    return (
      <div className="add-spot-form">
        <strong>1. Click on the map to select a location.</strong>
        {this.stepOne()}

        <br />
        <strong>2. Describe when trickers practice here.</strong>
        {this.stepTwo()}

        <br />
        <strong>3. Describe the location.</strong>
        {this.stepThree()}

        <button onClick={this.finish}>
          Finish <ChevronRight />
        </button>

        <Prompt
          when={this.state.selectedLocationHasChanged && !this.state.done}
          message="Are you sure you want to navigate away from this page? You will lose any form progress"
        />
      </div>
    );
  }

  stepOne() {
    return (
      <HostGatheringMap
        containerElement={<div style={{ height: '40vh', width: '100%' }} />}
        mapElement={<div style={{ height: '100%', width: '100%' }} />}
        center={
          this.state.selectedLocationHasChanged ? this.state.selectedLocation : this.props.center
        }
        marker={
          this.state.selectedLocationHasChanged ? this.state.selectedLocation : this.props.center
        }
        onPlacesChanged={() => this.searchPlaces()}
        onSearchBoxMounted={box => (this._searchBox = box)}
        onMapClick={event =>
          this.setState({
            selectedLocationHasChanged: true,
            selectedLocation: {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            }
          })
        }
      />
    );
  }

  searchPlaces() {
    const places = this._searchBox.getPlaces();
    if (places && places.length > 0) {
      const loc = places[0];
      console.info(loc);

      this.setState({
        selectedLocationHasChanged: true,
        selectedLocation: {
          lat: loc.geometry.location.lat(),
          lng: loc.geometry.location.lng()
        },
        title: loc.name,
        url: loc.url,
        placeId: loc.place_id
      });
    }
  }

  selectLocation({ x, y, lat, lng, event }) {
    console.info('Selected', lat, lng);
  }

  stepTwo() {
    return (
      <div>
        <div className="add-spot-select-frequency">
          <label>
            <input
              type="radio"
              name="frequency"
              onClick={() => this.setState({ frequency: 'once' })}
              checked={this.state.frequency === 'once'}
            />
            Just once
          </label>

          <label>
            <input
              type="radio"
              name="frequency"
              onClick={() => this.setState({ frequency: 'weekly' })}
              checked={this.state.frequency === 'weekly'}
            />
            Weekly
          </label>
          <label>
            <input
              type="radio"
              name="frequency"
              onClick={() => this.setState({ frequency: 'other' })}
              checked={this.state.frequency === 'other'}
            />
            Other
          </label>
        </div>

        <div className="add-spot-frequency">
          {this.state.frequency === 'once' && (
            <input
              type="date"
              onChange={event => this.setState({ date: event.target.valueAsNumber })}
            />
          )}
          {this.state.frequency === 'weekly' && this.weekdayOptions()}

          {this.state.frequency === 'other' && 'You can specify a schedule in the description'}
        </div>
      </div>
    );
  }

  toggleDay = event => {
    const day = event.target.value;
    const checked = event.target.checked;

    if (checked) {
      // Check it
      this.setState({
        weekly_days: [...this.state.weekly_days, day]
      });
    } else {
      // Uncheck it
      const selectedIndex = this.state.weekly_days.indexOf(day);
      const newWeeklyDays = [...this.state.weekly_days];
      newWeeklyDays.splice(selectedIndex, 1);
      this.setState({
        weekly_days: newWeeklyDays
      });
    }
  };

  dayIsSelected = day => {
    return this.state.weekly_days.indexOf(day) > -1;
  };

  weekdayOptions = () => {
    return WEEK_DAYS.map(day => (
      <label key={day}>
        <input
          type="checkbox"
          checked={this.dayIsSelected(day)}
          onChange={this.toggleDay}
          value={day}
        />
        {day}
      </label>
    ));
  };

  stepThree() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '5px' }}>
        <label>
          Title *<br />
          <input
            type="text"
            placeholder="Dope grass spot"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            pattern=".{4,}"
          />
        </label>

        <label>
          Website
          <br />
          <input
            type="text"
            value={this.state.url}
            onChange={event => this.setState({ url: event.target.value })}
            placeholder="Facebook, Meetup.com, whatever"
          />
        </label>

        <label>
          Description *<br />
          <textarea
            onChange={event => this.setState({ description: event.target.value })}
            rows={4}
            placeholder="When to meet, what to look for, what to bring, registration necessary, etc. Add your instagram handle too if you'd like"
            value={this.state.description}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={this.state.isSpringFloor}
            onChange={event => this.setState({ isSpringFloor: event.target.checked })}
          />
          Spring floors
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.isGrass}
            onChange={event => this.setState({ isGrass: event.target.checked })}
          />
          Grass
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.hasCrashPads}
            onChange={event => this.setState({ hasCrashPads: event.target.checked })}
          />
          Has crashpads
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.isFree}
            onChange={event => this.setState({ isFree: event.target.checked })}
          />
          Free (no fee to enter)
        </label>
      </div>
    );
  }

  finish = () => {
    let errors = [];

    if (this.state.frequency === 'once' && this.state.date == null) {
      errors.push('Select a date');
    }

    if (this.state.frequency === 'weekly' && this.state.weekly_days.length === 0) {
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
      const {
        isSpringFloor,
        isGrass,
        hasCrashPads,
        isFree,
        frequency,
        weekly_days,
        selectedLocation,
        title,
        url,
        description,
        placeId
      } = this.state;
      const uid = auth.currentUser.uid;

      let date = this.state.date + new Date().getTimezoneOffset() * 60 * 1000;

      db.ref('gatherings').push(
        {
          isSpringFloor,
          isGrass,
          isFree,
          hasCrashPads,
          frequency,
          weekly_days,
          selectedLocation,
          title,
          url,
          description,
          date,
          uid,
          created: new Date().getTime(),
          placeId
        },
        error => {
          if (error) {
            alert('Something went wrong! Please try again. If the problem persists, sorry!');
            console.error(error);
          } else {
            // It worked
            this.setState({
              done: true
            });
          }
        }
      );
    }
  };
}

const HostGatheringMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={10}
    center={props.center}
    onClick={props.onMapClick}
    options={{
      gestureHandling: 'greedy',
      mapTypeControl: false,
      streetViewControl: false
    }}>
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={window.google.maps.ControlPosition.LEFT_TOP}
      onPlacesChanged={props.onPlacesChanged}>
      <input type="text" placeholder="Search..." className="map-searchbox" />
    </SearchBox>
    <Marker position={props.marker} key="Test" defaultAnimation={2} />
  </GoogleMap>
));

export default withRouter(HostGathering);
