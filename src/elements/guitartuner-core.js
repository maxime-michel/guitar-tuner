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
      <style>
        .main {
          width: 100%;
          height: 100%;
          background: #37474F center center no-repeat;
          background-image: none;

          display:-webkit-flex;
          display:-ms-flexbox;
          display:flex;

          -webkit-flex-direction: column;
              -ms-flex-direction: column;
                  flex-direction: column;
          -webkit-flex-wrap: nowrap;
              -ms-flex-wrap: nowrap;
                  flex-wrap: nowrap;
          -webkit-justify-content: center;
              -ms-flex-pack: center;
                  justify-content: center;
          -webkit-align-content: space-between;
              -ms-flex-line-pack: justify;
                  align-content: space-between;
          -webkit-align-items: center;
              -ms-flex-align: center;
                  align-items: center;

          &:after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;

            opacity: 0;
            transition: opacity 0.333s cubic-bezier(0,0,0.21,1) 0.5s;
          }
        }

        .unsupported {
          .main {
            &:after {
              opacity: 1;
              background: #37474F url(/images/unsupported.png) center center no-repeat;
            }

            & * {
              transition: opacity 0.333s cubic-bezier(0,0,0.21,1);
              opacity: 0;
            }
          }
        }

        .supported .main:after {
          display: none;
        }

        @media (min-height: 544px) and (min-width: 600px) {
          .main {
            max-width: 600px;
            max-height: 544px;
            border-radius: 2px;
            box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                0 2px 9px 1px rgba(0, 0, 0, 0.12),
                0 4px 2px -2px rgba(0, 0, 0, 0.2);
          }
        }
      </style>
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
