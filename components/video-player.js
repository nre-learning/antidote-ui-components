import { html } from 'lit-html';
import {
  component,
  useState,
  useEffect
} from "haunted";

import getComponentStyleSheetURL from '../helpers/stylesheet';

export function getPlayerType (url) {
  if (!url) {
    console.error('No video url set in lesson')
    return
  }

  const isYoutubeVideo = url.indexOf('youtube.com') !== -1
    || url.indexOf('youtu.be') !== -1

  return isYoutubeVideo ? 'youtube' : 'native'
}

export function getVideoType (url) {
  const regex = /\.\w{3,4}($|\?)/
  const match = url && url.match(regex)
  const videoExtension = match && match[0]
  const videoType = (typeof videoExtension === 'string')
    ? videoExtension.replace('.', '')
    : ''

  return videoType
}

export function getVideoPlayer({ url, videoType, playerType }) {
  // validate url first as good url, with supported extension for file,
  // embed in url for youtube sources?
  playerType = playerType || getPlayerType(url)
  videoType = videoType || getVideoType(url)

  if (playerType === 'youtube') {
    return html`
      <div class="video-wrapper">
        <iframe
          src=${url}
          frameborder="0"
          class="video-embed">
        </iframe>
      </div>
    `
  } else {
    return html`
      <div class="native-video-wrapper">
        <video class="native-video-embed" controls>
          <source src=${url} type="video/${getVideoType(url)}">
        </video>
      </div>
    `
  }
}

function VideoPlayer({ sourceUrl }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (typeof sourceUrl === 'string') {
      setUrl(sourceUrl)
    }
  }, [sourceUrl]);

  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    ${url
    ?
      html`
        ${getVideoPlayer({ url })}
      `
    :
    html`
        <div class="no-video-container">
          <div>URL is Empty</div>
            <video id="video" width="560" height="315">
            </video>
          <div class="overlay-desc">
            <h1>No Video Selected</h1>
          </div>
        </div>
      `
    }
  `;
}

VideoPlayer.observedAttributes = ['source-url'];

customElements.define("video-player", component(VideoPlayer));

export default VideoPlayer;
