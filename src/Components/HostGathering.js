import React, { Component } from "react";
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { db, auth } from "../firebase";
import { Prompt } from "react-router-dom";
import { Redirect, withRouter } from "react-router-dom";
import SearchBox from "react-google-maps/lib/components/places/SearchBox";

const weekdays = [
  "Sundays",
  "Mondays",
  "Tuesdays",
  "Wednesdays",
  "Thursdays",
  "Fridays",
  "Saturdays"
];

const INPUT_STYLE = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `240px`,
  height: `32px`,
  padding: `1rem`,
  margin: "1rem",
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  outline: `none`,
  textOverflow: `ellipses`
};

const HostGatheringMap = withGoogleMap(props => (
  <GoogleMap defaultZoom={10} center={props.center} onClick={props.onMapClick}>
    <SearchBox
      ref={props.onSearchBoxMounted}
      controlPosition={window.google.maps.ControlPosition.LEFT_TOP}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input type="text" placeholder="Search..." style={INPUT_STYLE} />
    </SearchBox>
    <Marker position={props.marker} key="Test" defaultAnimation={2} />
  </GoogleMap>
));

class HostGathering extends Component {
  state = {
    isSpringFloor: false,
    isGrass: false,
    hasCrashPads: false,
    isFree: false,
    frequency: "weekly",
    weekly_days: ["Saturdays", "Fridays"],
    selectedLocation: {
      lat: this.props.center.lat,
      lng: this.props.center.lng
    },
    selectedLocationHasChanged: false,
    date: null,
    time: null,
    stepIndex: 0,
    title: "",
    url: "",
    description: "",
    done: false
  };

  stepOne() {
    return (
      <div style={{ height: "400px", width: "100%" }}>
        <HostGatheringMap
          containerElement={<div style={{ height: "100%", width: "100%" }} />}
          mapElement={<div style={{ height: "100%", width: "100%" }} />}
          center={
            this.state.selectedLocationHasChanged
              ? this.state.selectedLocation
              : this.props.center
          }
          marker={
            this.state.selectedLocationHasChanged
              ? this.state.selectedLocation
              : this.props.center
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
      </div>
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
        title: loc.name
      });
    }
  }

  selectLocation({ x, y, lat, lng, event }) {
    console.info("Selected", lat, lng);
  }

  stepTwo() {
    return (
      <div style={{ padding: "5px" }}>
        <h3>How often does this gathering occur?</h3>
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          <div style={{ flex: 1 }}>
            <input
              type="radio"
              name="frequency"
              onChange={(event, newFrequency) =>
                this.setState({ frequency: newFrequency })
              }
              value="once"
              selected={this.state.frequency === "once"}
            />{" "}
            Just once
            <input
              type="radio"
              name="frequency"
              onChange={(event, newFrequency) =>
                this.setState({ frequency: newFrequency })
              }
              value="weekly"
              selected={this.state.frequency === "weekly"}
            />{" "}
            Weekly
            <input
              type="radio"
              name="frequency"
              onChange={(event, newFrequency) =>
                this.setState({ frequency: newFrequency })
              }
              value="other"
              selected={this.state.frequency === "other"}
            />{" "}
            Other
          </div>

          <div style={{ flex: 2 }}>
            {this.state.frequency === "once" && null
            // <DatePicker
            //   hintText="What date?"
            //   onChange={(event, date) => this.setState({ date })}
            //   value={this.state.date}
            // />
            }
            {this.state.frequency === "once" && null
            // <TimePicker
            //   hintText="At what time?"
            //   minutesStep={10}
            //   onChange={(event, time) => this.setState({ time })}
            //   value={this.state.date}
            // />
            }
            {this.state.frequency === "weekly" &&
              this.menuItems(this.state.weekly_days)}
            {this.state.frequency === "other" &&
              "You can specify a schedule in the next step"}
          </div>
        </div>
      </div>
    );
  }

  getMergedDate() {
    if (this.state.date && this.state.time) {
      return new Date(
        this.state.date.toDateString() + " " + this.state.time.toTimeString()
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
      <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
        <input
          type="text"
          placeholder="Give your gathering a title"
          value={this.state.title}
          onChange={(event, title) => this.setState({ title })}
        />
        <input
          type="text"
          value={this.state.url}
          onChange={(event, url) => this.setState({ url })}
          placeholder="Facebook, Meetup.com, whatever"
        />
        <br />
        <textarea
          onChange={(event, description) => this.setState({ description })}
          rows={4}
          placeholder="When to meet, what to look for, what to bring, registration necessary, etc. Add your instagram handle too if you'd like"
        >
          {this.state.description}
        </textarea>
        />
        <h4>About the location</h4>
        <input type="checkbox"
          checked={this.state.isSpringFloor}
          onCheck={(event, b) => this.setState({ isSpringFloor: b })}
        />Spring floors
        <input type="checkbox"
          checked={this.state.isGrass}
          onCheck={(event, b) => this.setState({ isGrass: b })}
        />Grass
        <input type="checkbox"
          checked={this.state.hasCrashPads}
          onCheck={(event, b) => this.setState({ hasCrashPads: b })}
        />Has crashpads
        <input type="checkbox"
          checked={this.state.isFree}
          onCheck={(event, b) => this.setState({ isFree: b })}
        />Free (no fee to enter)
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
    if (!auth.currentUser) {
      return <Redirect to={{ pathname: "/login", state: { from: "/host" } }} />;
    }

    if (this.state.done) {
      return (
        <div style={{ padding: "5px" }}>
          <h2>Success!</h2>
          <Redirect to="/browse" />
        </div>
      );
    }

    return (
      <div>
        {this.state.selectedLocationHasChanged && "(Done)"}
        <button onClick={() => this.setState({ stepIndex: 0 })}>Where</button>
        {!this.isStepTwoInvalid && "(Done)"}>
        <button onClick={() => this.setState({ stepIndex: 1 })}>When</button>
        <button onClick={() => this.setState({ stepIndex: 2 })}>Details</button>
        {this.getStepContent()}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {/*<FlatButton
            label="Back"
            disabled={this.state.stepIndex === 0}
           onClick={() => this.handlePrev()}
          />*/}

          {this.state.stepIndex === 2 && (
            <button primary={true} onClick={this.handleNext}>
              {this.state.stepIndex === 2 ? "Finish" : "Next"}
            </button>
          )}
        </div>
        {/* <Prompt
          when={this.state.selectedLocationHasChanged && !this.state.done}
          message="Are you sure you want to navigate away from this page? You will lose any form progress"
        /> */}
      </div>
    );
  }

  handlePrev() {
    this.setState({
      stepIndex: this.state.stepIndex - 1
    });
  }
  handleNext = event => {
    event.preventDefault();

    if (this.state.stepIndex < 2) {
      this.setState({
        stepIndex: this.state.stepIndex + 1
      });
    } else {
      this.finish();
    }
  };

  get isStepTwoInvalid() {
    const date = this.getMergedDate() ? this.getMergedDate().getTime() : null;
    return (
      (this.state.frequency === "once" && date == null) ||
      (this.state.frequency === "weekly" && this.state.weekly_days.length === 0)
    );
  }

  finish() {
    let errors = [];
    const date = this.getMergedDate() ? this.getMergedDate().getTime() : null;

    if (this.state.frequency === "once" && date == null) {
      errors.push("Select a date & time");
    }

    if (
      this.state.frequency === "weekly" &&
      this.state.weekly_days.length === 0
    ) {
      errors.push("Please select which days of the week you meet");
    }

    if (!this.state.selectedLocationHasChanged) {
      errors.push("Select a location");
    }

    if (this.state.title === "") {
      errors.push("Enter a title");
    }

    if (this.state.description.length < 7) {
      errors.push("Enter something useful in the description");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
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
        description
      } = this.state;
      const uid = auth.currentUser.uid;

      db.ref("gatherings").push(
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
          created: new Date().getTime()
        },
        error => {
          if (error) {
            alert(
              "Something went wrong! Please try again. If the problem persists, sorry!"
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
  }

  menuItems() {
    return weekdays.map(day => (
      <React.Fragment>
        {" "}
        <input
          type="checkbox"
          key={day}
          checked={this.state.weekly_days.indexOf(day) > -1}
          value={day}
        />
        {day}
      </React.Fragment>
    ));
  }
}

export default withRouter(HostGathering);
