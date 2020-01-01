import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from "recharts";
import ChartControls from "./ChartControls";

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 300;


export default class CsvDetails extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      width: props.width || DEFAULT_WIDTH,
      height: props.height || DEFAULT_HEIGHT,
    };

  }

  render() {
    return <div className="CsvDetails">
      {this.renderHead()}
      {this.renderChart()}
    </div>
  }

  renderHead() {
    return <div className="CsvDetails__head">
      <span className="CsvDetails__close-button" onClick={this.props.onClose}>X</span>
    </div>
  }


  renderChart() {
    const {width, height} = this.state;
    const {predictions} = this.props;

    return <ChartControls predictions={predictions} width={width} height={height} renderChart={this.renderChartWindow}/>;
  }

  renderChartWindow(width, height, data) {
    return <LineChart width={width} height={height} data={data} margin={{top: 5, right: 30, left: 0, bottom: 5}}>
      <XAxis dataKey="name"/>
      <YAxis/>
      <CartesianGrid strokeDasharray="3 3"/>
      <Tooltip/>
      <Legend/>
      <Line type="monotone" label="Predicted low" dataKey="predictedLow" stroke="#8884d8" activeDot={{r: 8}}/>
      <Line type="monotone" label="True low" dataKey="trueLow" stroke="#82ca9d"/>
    </LineChart>
  }



}