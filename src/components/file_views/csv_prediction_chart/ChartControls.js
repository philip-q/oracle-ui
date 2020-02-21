import React from "react";
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

const DEFAULT_WINDOW_SIZE = 50;
const DO_NOTHING = () => {
};

export default class ChartControls extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      isDraggingOffset: false,
      lastX: null,
      windowSize: props.windowSize || DEFAULT_WINDOW_SIZE
    };

    this.chartContainerRef = React.createRef();
    this.mouseMoveStream = new Subject()

  }

  componentDidMount() {
    this.mouseMoveStream
      .pipe(
        throttleTime(100)
      )
      .subscribe(event => {
        this.handleMouseMove(event)
      });

    this.chartContainerRef.current.addEventListener("wheel", this.handleWheel); // this way page not scrolls
  }

  render() {
    return <div className="ChartControls">
      {this.renderChart()}
      {this.renderControls()}
    </div>
  }

  renderChart() {
    const {offset} = this.state;
    const {predictions, width, height, renderChart} = this.props;

    let windowSize = 50;
    let shownArea = predictions.slice(offset, offset + windowSize);

    return <div ref={this.chartContainerRef}
                className="ChartControls__chart"
                onMouseDown={this.handleDragStart}
                onMouseLeave={this.handleDragEnd}
                onMouseUp={this.handleDragEnd}
                onMouseUpCapture={this.handleDragEnd}
                onMouseMove={this.getThrottledMouseMoveHandler()}
    >
      {renderChart(width, height, shownArea)}
    </div>;
  }

  renderControls() {
    return <div className="ChartControls__controls">
      <input
        className="ChartControls__control ChartControls__control--offset"
        value={this.state.offset}
        onChange={this.handleOffsetChange}
      />
    </div>
  }

  handleOffsetChange = (e) => {
    this.setState({offset: Number(e.target.value)})
  };

  handleDragStart = (e) => {
    this.setState({isDraggingOffset: true, lastX: e.clientX})
  };

  handleDragEnd = (e) => {
    this.setState({isDraggingOffset: false, lastX: null})
  };

  getThrottledMouseMoveHandler = () => {
    return this.state.isDraggingOffset ? (event) => this.mouseMoveStream.next(event) : DO_NOTHING;
  };

  handleMouseMove = (e) => {
    const {lastX, offset, isDraggingOffset, windowSize} = this.state;

    if (!isDraggingOffset) {
      return;
    }

    let chartArea = this.chartContainerRef.current
      .getElementsByTagName("defs")[0]
      .getElementsByTagName("rect")[0]
      .getBoundingClientRect();

    let chatAreaWidth = chartArea.right - chartArea.left;
    let deltaX = lastX - e.clientX;
    let deltaOffset = Math.round(deltaX * windowSize / chatAreaWidth);
    let nextOffset = Math.max(0, offset + deltaOffset);
    this.setState({offset: nextOffset, lastX: e.clientX})
  };

  handleWheel = (e) => {
    e.preventDefault();

    let smoothing = 3;

    const {windowSize} = this.state;
    let delta = e.deltaY;
    let relativeDelta = Math.round(delta * windowSize / 360 / smoothing);
    console.log("handleWheel relative delta", relativeDelta);
    this.setState({offset: Math.max(0, this.state.offset + relativeDelta)})
  }

}
