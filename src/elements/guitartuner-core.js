/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './audio-processor.js';
import './audio-visualizer.js';
import './tuning-instructions.js';
import '@polymer/paper-toast/paper-toast.js';

class GuitarTunerCore extends PolymerElement {

  static get template() {
    return html`
      <main class="main">
        <audio-processor></audio-processor>
        <audio-visualizer></audio-visualizer>
        <tuning-instructions></tuning-instructions>
      </main>
      <paper-toast text="Please click here to enable the tuner." opened duration="0"></paper-toast>
    `;
  }

  ready() {
    super.ready();

    // Don't you just love prefixed stuff? No? Me neither.
    window.AudioContext = window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.msAudioContext;

    if (typeof window.AudioContext === 'undefined' ||
        typeof navigator.mediaDevices.getUserMedia === 'undefined') {

      requestAnimationFrame(function() {
        document.body.classList.add('unsupported');
      });
      return;
    }

    document.body.classList.add('supported');
  }
}

customElements.define('guitar-tuner-core', GuitarTunerCore);