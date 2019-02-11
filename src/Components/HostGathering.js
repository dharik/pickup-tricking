import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { db, auth } from '../firebase';
import { Prompt, Link } from 'react-router-dom';
import { Redirect, withRouter } from 'react-router-dom';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { ChevronRight, Check } from 'react-feather';
import { produce } from 'immer';
import './HostGathering.scss';

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
    selectedLocationTouched: false,
    title: '',
    url: '',
    description: '',
    done: false,
    placeId: null,
    contactType: 'instagram',
    contactInfo: ''
  };

  render() {
    if (!auth.currentUser) {
      return <Redirect to={{ pathname: '/login', state: { from: '/host' } }} />;
    }

    if (this.state.done) {
      return (
        <div style={{ padding: '5px' }}>
          <h2>
            <Check /> Thank you for your contribution!
          </h2>
          <Link to="/browse">Click here to go back to the map</Link>
        </div>
      );
    }

    return (
      <div className="add-spot-form">
        1. Click on the map to select a location.
        {this.stepOne()}
        <br />
        2. Describe when trickers practice here.
        {this.stepTwo()}
        <br />
        3. Describe the location.
        <br />
        <br />
        {this.stepThree()}
        <button onClick={this.finish}>
          Finish <ChevronRight />
        </button>
        <Prompt
          when={this.state.selectedLocationTouched && !this.state.done}
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
        center={this.state.selectedLocation}
        marker={this.state.selectedLocation}
        onPlacesChanged={() => this.searchPlaces()}
        onSearchBoxMounted={box => (this._searchBox = box)}
        onMapClick={event =>
          this.setState({
            selectedLocationTouched: true,
            selectedLocation: {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            },
            title: '',
            url: '',
            placeId: null
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
        selectedLocationTouched: true,
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

  stepTwo() {
    return (
      <div>
        <div className="add-spot-select-frequency">
          <button
            className={`btn ${this.state.frequency === 'weekly' ? 'selected' : ''}`}
            onClick={() => this.setState({ frequency: 'weekly' })}>
            Weekly
          </button>
          <button
            className={`btn ${this.state.frequency === 'other' ? 'selected' : ''}`}
            onClick={() => this.setState({ frequency: 'other' })}>
            Other
          </button>
        </div>

        <div className="add-spot-frequency">
          {this.state.frequency === 'weekly' &&
            WEEK_DAYS.map(day => (
              <label key={day}>
                <input
                  type="checkbox"
                  checked={this.state.weekly_days.indexOf(day) > -1}
                  onChange={this.toggleDay}
                  value={day}
                />{' '}
                {day}
              </label>
            ))}

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
      this.setState(
        produce(this.state, draft => {
          draft.weekly_days.push(day);
        })
      );
    } else {
      // Uncheck it
      this.setState(
        produce(this.state, draft => {
          const selectedIndex = this.state.weekly_days.indexOf(day);
          draft.weekly_days.splice(selectedIndex, 1);
        })
      );
    }
  };

  stepThree() {
    const CONTACT_PLACEHOLDER = {
      instagram: 'Instagram handle',
      facebook: 'Facebook name',
      email: 'Email address'
    };

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
            placeholder={'Facebook, Meetup.com, whatever'}
          />
        </label>

        <label>
          How can other trickers contact you?
          <br />
          <select onChange={event => this.setState({ contactType: event.target.value })}>
            <option value="instagram">Instagram DM</option>
            <option value="facebook">Facebook DM</option>
            <option value="email">Email</option>
          </select>
          <input
            type="text"
            value={this.state.contactInfo}
            onChange={event => this.setState({ contactInfo: event.target.value })}
            placeholder={CONTACT_PLACEHOLDER[this.state.contactType]}
          />
        </label>

        <label>
          Description *<br />
          <textarea
            onChange={event => this.setState({ description: event.target.value })}
            rows={4}
            placeholder="When to meet, what to look for, what to bring, registration necessary, etc."
            value={this.state.description}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={this.state.isSpringFloor}
            onChange={event => this.setState({ isSpringFloor: event.target.checked })}
          />{' '}
          Spring floors
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.isGrass}
            onChange={event => this.setState({ isGrass: event.target.checked })}
          />{' '}
          Grass
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.hasCrashPads}
            onChange={event => this.setState({ hasCrashPads: event.target.checked })}
          />{' '}
          Has crashpads
        </label>
        <label>
          <input
            type="checkbox"
            checked={this.state.isFree}
            onChange={event => this.setState({ isFree: event.target.checked })}
          />{' '}
          Free (no fee to enter)
        </label>
      </div>
    );
  }

  finish = () => {
    let errors = [];

    if (this.state.frequency === 'weekly' && this.state.weekly_days.length === 0) {
      errors.push('Please select which days of the week you meet');
    }

    if (!this.state.selectedLocationTouched) {
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
        placeId,
        contactInfo,
        contactType
      } = this.state;
      const uid = auth.currentUser.uid;

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
          uid,
          created: new Date().getTime(),
          placeId,
          contactInfo,
          contactType
        },
        error => {
          if (error) {
            alert(
              'Something went wrong! Please try again. If the problem persists, email dharik@trick-spot.com and I will get it fixed for you!'
            );
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
