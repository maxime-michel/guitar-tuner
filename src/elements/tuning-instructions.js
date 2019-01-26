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

class TuningInstructions extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          width: 140px;
          height: 100px;
        }

        :host(.resolved) #indicator {
          width: 56px;
          height: 56px;
          background: #FFF;
          border-radius: 50%;
          margin: 0 auto;
        }

        :host(.resolved) #indicator::after {
          content: '';
          display: block;
          background: red;
        }

        #message {
          width: 100%;
          font-family: 'Roboto';
          font-weight: 400;
          font-size: 14px;
          line-height: 1;
          margin: 8px 0 0 0;
          text-align: center;
          color: #888;
          margin-top: 10px;
        }

        #indicator {
          position: relative;
        }

        #up, #down, #tick {
          opacity: 0;
        }

        :host(.resolved) #up,
        :host(.resolved) #down {
          position: absolute;
          top: 0;
          left: 0;
          width: 56px;
          height: 56px;
          opacity: 0;
          will-change: transform;
          transition: opacity 0.133s cubic-bezier(0,0,0.21,1) 50ms,
              transform 0.133s cubic-bezier(0,0,0.21,1) 50ms;
          background: url(src/elements/up-down.svg) center center no-repeat;
        }

        :host(.resolved) #down {
          transform: rotate(180deg);
        }

        :host(.resolved) #tick {
          position: absolute;
          top: 0;
          left: 0;
          width: 56px;
          height: 56px;
          opacity: 0;
          will-change: transform;
          transition: opacity 0.133s cubic-bezier(0,0,0.21,1) 50ms,
              transform 0.133s cubic-bezier(0,0,0.21,1) 50ms;
          background: url(src/elements/tick.svg) center center no-repeat;
          transform: rotate(180deg);
        }

        #indicator.tune-down #down {
          opacity: 1;
          transform: rotate(0deg);
        }

        #indicator.tune-up #up {
          opacity: 1;
          transform: rotate(180deg);
        }

        #indicator.in-tune #tick {
          opacity: 1;
          transform: rotate(0deg);
        }

        :host(.resolved) #message {
          display: block;
        }

        #frequency {
          width: 100px;
          text-align: center;
          color: #F39731;
        }

        #divider {
          width: 20px;
        }

        #stringfrequency {
          width: 100px;
          text-align: center;
        }
      </style>

      <div id="indicator">
        <div id="up"></div>
        <div id="down"></div>
        <div id="tick"></div>
      </div>
      <div id="message">
        <span id="frequency">-</span>
        <span id="divider">/</span>
        <span id="stringfrequency">-</span>
      </div>
    `;
  }

  constructor () {
    // Defer normal constructor behavior to created because we're only
    // allowed to take the prototype with us from the class.
    //Polymer(TuningInstructions.prototype);
  }

  ready () {
    super.ready();

    this.audioProcessor = document.querySelector('audio-processor');
    this.requestedAnimationFrame = false;
    this.tolerance = 0.006;
    this.frequencyToRender = -1;

    this.frequencies = {
      e2: 82.4069,
      a2: 110.000,
      d3: 146.832,
      g3: 195.998,
      b3: 246.942,
      e4: 329.628
    };

    this.linearizedFrequencies = {
      e2: Math.log2(this.frequencies.e2 / 440),
      a2: Math.log2(this.frequencies.a2 / 440),
      d3: Math.log2(this.frequencies.d3 / 440),
      g3: Math.log2(this.frequencies.g3 / 440),
      b3: Math.log2(this.frequencies.b3 / 440),
      e4: Math.log2(this.frequencies.e4 / 440)
    };

    this.onAudioData = this.onAudioData.bind(this);

  }

  connectedCallback () {
    super.connectedCallback();

    this.frequencyMessage = this.$.frequency;
    this.stringFrequencyMessage = this.$.stringfrequency;
    this.indicator = this.$.indicator;

    this.audioProcessor.addEventListener('audio-data', this.onAudioData);

    setTimeout(() => this.classList.add('resolved'), 100);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.audioProcessor.removeEventListener('audio-data', this.onAudioData);
  }

  onAudioData (e) {

    let frequency = e.detail.frequency;
    let linearizedFrequency = Math.log2(frequency / 440);

    // Figure out which is the nearest string.
    let distances = {
      e2: linearizedFrequency - this.linearizedFrequencies.e2,
      a2: linearizedFrequency - this.linearizedFrequencies.a2,
      d3: linearizedFrequency - this.linearizedFrequencies.d3,
      g3: linearizedFrequency - this.linearizedFrequencies.g3,
      b3: linearizedFrequency - this.linearizedFrequencies.b3,
      e4: linearizedFrequency - this.linearizedFrequencies.e4
    };

    let distanceKeys = Object.keys(distances);
    let smallestDistance = Number.MAX_VALUE;
    let smallestDistanceKey = '';

    for (let d = 0; d < distanceKeys.length; d++) {

      let key = distanceKeys[d];

      if (Math.abs(distances[key]) < smallestDistance) {
        smallestDistance = distances[key];
        smallestDistanceKey = key;
      }
    }

    // Reset the indicator
    this.indicator.classList.remove('tune-up');
    this.indicator.classList.remove('tune-down');
    this.indicator.classList.remove('in-tune');

    if (smallestDistance < -this.tolerance) {
      this.indicator.classList.add('tune-up');
    } else if (smallestDistance > this.tolerance) {
      this.indicator.classList.add('tune-down');
    } else {
      this.indicator.classList.add('in-tune');
    }

    if (this.frequencyToRender === -1)
      this.frequencyToRender = frequency;

    this.frequencyToRender += (frequency - this.frequencyToRender) * 0.15;

    this.frequencyMessage.textContent =
        this.frequencyToRender.toFixed(2) + 'Hz';
    this.stringFrequencyMessage.textContent =
        this.frequencies[smallestDistanceKey].toFixed(2) + 'Hz';

  }
}

customElements.define('tuning-instructions', TuningInstructions);
