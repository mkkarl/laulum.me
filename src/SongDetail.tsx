import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from "react-router-dom";

import slugify from "./slugify";
import { Song } from "./types";

const tgShareLink = (url: string, song: Song) => {
  // I'm not sure whether a limit exists on Telegram's side or not. Adjust as necessary.
  // Note: Some web servers refuse to deal with header lines longer than 4096 bytes if my memory serves me right.
  const CHARLIM = 9001;
  const stem = "https://t.me/share/url";
  const urlify = (text: string) => {
    return (
      stem +
      "?url=" +
      encodeURIComponent(url) +
      "&text=" +
      encodeURIComponent(text)
    );
  };
  const head = song.melody
    ? song.title + "\n(melod. " + song.melody + ")"
    : song.title;
  const text = head + "\n\n" + song.lyrics;
  const full = urlify(text);
  if (full.length <= CHARLIM) {
    return full;
  }
  return urlify(head);
};

interface SongDetailProps {
  /** List of songs where from the selected song is retrieved */
  songs: Song[];
}

const SongDetail = (props: SongDetailProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const { songs } = props;
  const song = useMemo(
    () => songs.find((song) => slugify(song.title) === slug),
    [songs, slug]
  );

  if (song === undefined) {
    return (
      <div className="song-details">
        <Helmet>
          <title>laulum.me | 404</title>
        </Helmet>
        <div className="centered">
          <div className="lyrics">
            <button className="dank" onClick={() => navigate("/")}>
              Back to all songs
            </button>
            <div className="song-content">
              <h3>404 - Song not found</h3>
              <div className="song-info">
                <span>That song was not found.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { title, melody, lyrics, writers } = song;

  return (
    <div className="song-details">
      <Helmet>
        <title>laulum.me | {title}</title>
      </Helmet>
      <div className="centered">
        <div className="lyrics">
          <button className="dank" onClick={() => navigate("/")}>
            Back to all songs
          </button>
          <a
            className="tg-share-button"
            href={tgShareLink(document.location.href, song)}
            target="_blank"
            rel="noreferrer noopener"
          >
            Share on Telegram
          </a>
          <div className="song-content">
            <h3>{title}</h3>
            <div className="song-info">
              {melody && (
                <>
                  melody: {melody} <br />
                </>
              )}
              {writers && <>lyrics by: {writers}</>}
            </div>
            <p>
              {lyrics.split("\n").map((line, i) => (
                <span key={`line-${i}`}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetail;