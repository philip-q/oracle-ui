export default class TickPrediction {

  predictedLow;
  predictedHigh;

  trueLow;
  trueHigh;

  constructor(builder) {
    this.predictedLow = builder["predicted_low"];
    this.predictedHigh = builder["predicted_high"];
    this.trueLow = builder["true_low"];
    this.trueHigh = builder["true_high"];
  }

}