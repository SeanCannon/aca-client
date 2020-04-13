import React from 'react';
import ShareData from './ShareData';
import './Share.css';
import Facebook from './assets/facebook.svg';
import Twitter from './assets/twitter.svg';
import Linkedin from './assets/linkedin.svg';

const Share = () => {
  return (
    <div className="share-container">
      <p>Share</p>
      <ul>
        <li>
          <a
            href={ShareData.facebook.url}
            title="Share on Facebook">
            <img src={Facebook} alt="Share on Facebook" />
          </a>
        </li>
        <li>
          <a
            href={ShareData.twitter.url}
            title="Share on Twitter">
            <img src={Twitter} alt="Share on Facebook" />
          </a>
        </li>
        <li>
          <a
            href={ShareData.linkedin.url}
            title="Share on LinkedIn">
            <img src={Linkedin} alt="Share on Facebook" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Share;
