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
import {getFloatTimeDomainData} from '../get-float-time-domain-data.js';

class GuitarTunerCore extends PolymerElement {

  static get template() {
    return html`
      <main class="main">
        <audio-processor id="audioProcessor"></audio-processor>
        <audio-visualizer id="audioVisualizer"></audio-visualizer>
        <tuning-instructions id="tuningInstructions"></tuning-instructions>
      </main>
      <paper-toast id="toast" text="Cliquez ici pour démarrer l'accordeur." opened duration="0" on-click="start"></paper-toast>
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

    this.$.audioProcessor.addEventListener('audio-data', (e)=>this._onAudioData(e));

    getFloatTimeDomainData();
  }

  _onAudioData(e) {
    this.$.tuningInstructions.onAudioData(e);
    this.$.audioVisualizer.onAudioData(e);
  }

  start() {
    this.$.audioProcessor.start();
    this.$.toast.toggle();
  }
}

customElements.define('guitar-tuner-core', GuitarTunerCore);
