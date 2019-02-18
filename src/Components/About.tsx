import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Github, Mail, Instagram, PlusCircle } from 'react-feather';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <p className="about-header">
        TrickSpot is a tool to find &amp; share places to practice the art of tricking.
      </p>

      <p className="about-cta-container">
        While you're here, add a spot - gyms, grass sessions, gatherings, etc - for other trickers
        to check out.
      </p>

      <Link to="/host" className="add-spot">
        <PlusCircle style={{ height: '1em', width: '1em' }} /> Add a spot
      </Link>

      <div className="about-why">
        <p>
          The tricking community is growing fast but it can still be a challenge to find others who
          are in to it.
        </p>
        <ul>
          <li>The word "tricking" doesn't yield relevant results in search engines.</li>
          <li>
            Tricking can be practiced in a variety of places: gyms, parks, beaches. We can't just
            search google maps.
          </li>
          <li>Facebook and meetup groups are difficult to search for by location.</li>
        </ul>

        <p>
          If you have any ideas to make TrickSpot better, shoot me a message. If you'd like to get
          involved, I could use a hand with anything: Graphic design, UX design, backend (currently
          Firebase), frontend (React).
        </p>
        <p>
          <Instagram size="1rem" color="#ffffffea" />{' '}
          <a href="https://www.instagram.com/dharik92">dharik92</a>
        </p>
        <p>
          <Mail size="1rem" color="#ffffffea" />{' '}
          <a href="mailto:dharik@trick-spot.com">dharik@trick-spot.com</a>
        </p>
        <p>
          <Github size="1rem" color="#ffffffea" />{' '}
          <a href="https://github.com/dharik/pickup-tricking">GitHub</a>
        </p>
      </div>
    </div>
  );
};

export default withRouter(About);
