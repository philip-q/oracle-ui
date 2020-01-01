import React from "react";

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
                onMouseMove={this.getDragHandler()}
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

  getDragHandler = () => {
    return this.state.isDraggingOffset ? this.handleMouseMove : DO_NOTHING;
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

}