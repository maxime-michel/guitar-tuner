// polymer-compatible duplicate of the following node module:
// https://github.com/mohayonao/get-float-time-domain-data

export function getFloatTimeDomainData() {
  if (self.AnalyserNode && !self.AnalyserNode.prototype.getFloatTimeDomainData) {
    var uint8 = new Uint8Array(2048);
    self.AnalyserNode.prototype.getFloatTimeDomainData = function(array) {
      this.getByteTimeDomainData(uint8);
      for (var i = 0, imax = array.length; i < imax; i++) {
        array[i] = (uint8[i] - 128) * 0.0078125;
      }
    };
  }
}
