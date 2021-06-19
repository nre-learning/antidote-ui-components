import { html } from 'lit-html';
import {
  component,
  useState,
  useEffect
} from "haunted";

import getComponentStyleSheetURL from '../helpers/stylesheet';

export function getPlayerType (sourceUrl) {
  if (!sourceUrl) {
    console.error('No video url set in lesson')
    return
  }

  const isYouTubeVideo = sourceUrl.indexOf('youtube.com') !== -1
    || sourceUrl.indexOf('youtu.be') !== -1

  return isYouTubeVideo ? 'youtube' : 'native'
}

export function getVideoType (sourceUrl) {
  const regex = /\.\w{3,4}($|\?)/
  const match = sourceUrl && sourceUrl.match(regex)
  const videoExtension = match && match[0]
  const videoType = (typeof videoExtension === 'string')
    ? videoExtension.replace('.', '')
    : ''

  return videoType
}

export function getVideoPlayer({ sourceUrl, videoType, playerType }) {
  playerType = playerType || getPlayerType(sourceUrl)
  videoType = videoType || getVideoType(sourceUrl)

  if (playerType === 'youtube') {
    return html`
      <div class="video-wrapper">
        <iframe
          src=${sourceUrl}
          frameborder="0"
          class="video-embed">
        </iframe>
      </div>
    `
  } else {
    return html`
      <div class="native-video-wrapper">
        <video class="native-video-embed" controls>
          <source src=${sourceUrl} type="video/${getVideoType(sourceUrl)}">
        </video>
      </div>
    `
  }
}

function VideoPlayer({ sourceUrl }) {
  return html`
    <link rel="stylesheet" href=${getComponentStyleSheetURL(this)} />
    ${sourceUrl && sourceUrl.length
    ?
      html`
        ${getVideoPlayer({ sourceUrl })}
      `
    : html``
    }
  `;
}

VideoPlayer.observedAttributes = ['source-url'];

customElements.define("video-player", component(VideoPlayer));

export default VideoPlayer;
