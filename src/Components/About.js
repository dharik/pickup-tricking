import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Github, Mail, Instagram } from 'react-feather';

const About = () => {
  return (
    <div style={{ padding: '10px' }}>
      <p>
        TrickSpot is a tool to find &amp; share places to practice the art of
        tricking.
      </p>

      <p>
        While you're here, <strong><Link to="/host">Add a spot</Link></strong> - gyms, grass sessions, gatherings,
        etc - for other trickers to check out.
      </p>

      <strong>Why does this exist?</strong>

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

      <strong>Comments or suggestions?</strong>
      <p>
        If you have any ideas to make TrickSpot better, shoot me a message. If you'd like to get
        involved, I could use a hand with anything: Graphic design, UX design, backend (currently
        Firebase), frontend (React).
      </p>

      <p>
        <Instagram size="1rem" /> <a href="https://www.instagram.com/dharik92">dharik92</a>
      </p>
      <p>
        <Mail size="1rem" /> <a href="mailto:dharik@trick-spot.com">dharik@trick-spot.com</a>
      </p>
      <p>
        <Github size="1rem" /> <a href="https://github.com/dharik/pickup-tricking">GitHub</a>
      </p>
    </div>
  );
};

export default withRouter(About);
