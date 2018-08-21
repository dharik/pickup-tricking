import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const About = () => {
  return (
    <div style={{ padding: '10px' }}>
      <h2>What is this?</h2>
      <p>
        <strong>TrickSpot</strong> is a tool to find &amp; share places to
        practice the art of{' '}
        <a
          href="https://en.wikipedia.org/wiki/Tricking_(martial_arts)"
          target="_blank"
        >
          tricking
        </a>.
      </p>

      <hr />

      <h2>Why was this made?</h2>
      <p>
        The tricking community is small (but growing) and it's a challenge to
        find others who are in to it. Specifically:
      </p>
      <ul>
        <li>
          The word "tricking" is doesn't yield relevant results in search
          engines.
        </li>
        <li>
          Tricking is practiced in a variety of places -- gyms, local parks,
          beaches. We can't look for one specific type of place.
        </li>
        <li>
          Facebook and meetup groups are difficult to search for by location.
        </li>
      </ul>

      <hr />

      <h2>How do I use this?</h2>
      <h5>If you're looking for a spot to trick</h5>
      <p>
        <Link to="/browse">Browse the map</Link> to find something close to you.
      </p>
      <h5>If you already have a spot</h5>
      <p>
        <Link to="/host">Add a spot</Link> so other trickers can find you.
      </p>

      <hr />

      <hr />
      <h2>Who made this?</h2>
      <p>
        I did, as a side-project. I've been tricking on &amp; off (mostly off)
        for at least five years. I can't spam dubs yet.
      </p>
      <p>
        <a href="mailto:dharik@trick-spot.com">
          Email me (dharik@trick-spot.com)
        </a>{' '}
        with any questions, suggestions, or general feedback.
      </p>
    </div>
  );
};

export default withRouter(About);
