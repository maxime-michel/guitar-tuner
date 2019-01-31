# Guitar Tuner

![Guitar Tuner](https://accordeur.accordersaguitare.com/src/images/grabs.png)

A sample web app that lets you tune a guitar. It uses ES6 classes (via Babel) and [Polymer](https://www.polymer-project.org/).

The app was converted to Polymer 3 in early 2019 to keep up with new Chrome APIs. The first blow was the mandatory user interaction before user media is requested. Then came the impending removal of `HTML Imports`, `document.registerElement` and `Element.createShadowRoot`.

[You can see the old (by now broken) app here](https://guitar-tuner.appspot.com/), [and the new one here](https://accordeur.accordersaguitare.com/).

Future development should bring the service worker back, as well as allow multi-language.

## License

Copyright 2015 Google, Inc.

Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements. See the NOTICE file distributed with this work for additional information regarding copyright ownership. The ASF licenses this file to you under the Apache License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

Please note: this is not a Google product
