import React, { Component } from "react";
import { db, auth } from "../firebase";
import { Redirect, Link } from "react-router-dom";

class ManageGatherings extends Component {
  state = {
    gatherings: []
  };

  componentDidMount() {
    auth.onAuthStateChanged(next => {
      if (next) {
        db.ref("gatherings")
          .orderByChild("uid")
          .equalTo(auth.currentUser.uid)
          .once("value")
          .then(snapshot => {
            let gatherings = [];
            snapshot.forEach(item => {
              gatherings.push(item.val());
            });
            this.setState({ gatherings });
          });
      } else {
        this.props.history.push("/login", { from: "/mine" });
      }
    });
  }

  render() {
    return (
      <div style={{ padding: "5px" }}>
        <h3>Spots I've added</h3>
        {this.state.gatherings.length === 0 && (
          <p>
            None yet! How about you <Link to="/host">add one</Link>?
          </p>
        )}
        <div>
          {this.state.gatherings.map((gathering, index) => {
            let frequencyText = "";
            if (gathering.frequency === "once") {
              frequencyText =
                "Occurs once on " +
                new Date(gathering.date).toLocaleDateString();
            } else if (gathering.frequency === "weekly") {
              frequencyText =
                "Occurs weekly on " + gathering.weekly_days.join(", ");
            }

            return (
              <React.Fragment>
                {gathering.title}
                {frequencyText}
                {gathering.description}
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${
                    gathering.selectedLocation.lat
                  }, ${
                    gathering.selectedLocation.lng
                  }&zoom=14&size=800x250&maptype=roadmap&markers=color:red%7Clabel:Spot%7C${
                    gathering.selectedLocation.lat
                  }, ${gathering.selectedLocation.lng}
&key=AIzaSyBUoa5u8pUE5UayWD-QL7Ff8gNQUSaVU84`}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ManageGatherings;
