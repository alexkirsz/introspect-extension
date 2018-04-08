import React from "react";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryScatter,
  VictoryLabel,
  VictoryPortal,
  VictoryArea,
  VictoryBar,
  rect,
  text
} from "victory";
import moment from "moment";
import emojiCodes from "./emojiCodes";
import styles from "./Trends.css";

const N_TICKS = 5;
const clrs = [
  "#0074D9",
  "#01FF70",
  "#FF851B",
  "#B10DC9",
  "#7FDBFF",
  "#FFDC00",
  "#85144b"
];

class EmojiPoint extends React.Component {
  render() {
    const EmojiImageURL = window.require("EmojiImageURL");
    const EmojiLikeConstants = window.require("EmojiLikeConstants");
    const Image = window.require("Image.react");
    const { x, y, datum } = this.props; // VictoryScatter supplies x, y and datum
    const emoji = datum.emoji;
    let scores = emoji.map((s, i) => [s, i]);
    scores.sort((a, b) => b[0] - a[0]);
    const score = emojiCodes[scores[0][1]];
    return (
      <VictoryPortal>
        <foreignObject x={this.props.x} y={this.props.y} width="16" height="16">
          <Image
            alt={String.fromCodePoint(parseInt(score, 16))}
            src={EmojiImageURL.getMessengerURL(
              score,
              EmojiLikeConstants.sizeMap.small
            )}
            className={styles.emoji}
          />
        </foreignObject>
      </VictoryPortal>
    );
  }
}

class LabelFace extends React.Component {
  state = {
    src: null
  };

  componentDidMount() {
    window
      .require("MercuryParticipants")
      .get(this.props.datum.author, author =>
        this.setState(() => ({ src: author.image_src }))
      );
  }

  render() {
    const Image = window.require("Image.react");
    if (
      this.props.datum !== this.props.data[this.props.data.length - 1] ||
      this.state.src === null
    )
      return null;
    return (
      <VictoryPortal>
        <foreignObject x={this.props.x} y={this.props.y} width="16" height="16">
          <Image src={this.state.src} className={styles.picture} />
        </foreignObject>
      </VictoryPortal>
    );
  }
}

export default class Trends extends React.Component {
  constructor(props) {
    super(props);

    const first = props.actions[0].timestamp;
    const last = props.actions[props.actions.length - 1].timestamp;

    this.state = {
      domain: [first, last]
    };
  }

  getTickValues() {
    if (this.props.actions.length === 0) return [];
    if (this.props.actions.length === 1) return this.props.actions[0].timestamp;
    const first = this.props.actions[0].timestamp;
    const last = this.props.actions[this.props.actions.length - 1].timestamp;
    const tick = Math.ceil((last - first) / this.props.trends.length);
    return new Array(this.props.trends.length)
      .fill(null)
      .map((a, i) => first + i * tick)
      .concat([last]);
  }

  getDataForLine(data, lineId, extremas = null, filter = false) {
    const first = this.props.actions[0].timestamp;
    const last = this.props.actions[this.props.actions.length - 1].timestamp;
    const step = (last - first) / this.props.actions.length;
    const processed = data
      .filter(
        l =>
          l.author === lineId &&
          (!filter ||
            (l.timestamp >= this.state.domain[0] &&
              l.timestamp <= this.state.domain[1]))
      )
      .map(l => ({
        x: first + (data.indexOf(l) + 0.5) * step,
        y: l.sentiment,
        ...l
      }));
    const sorted = processed.slice();
    sorted.sort((a, b) => a.y - b.y);
    let minHigh = sorted[0];
    let maxLow = sorted[sorted.length - 1];
    if (extremas !== null) {
      maxLow = sorted[Math.min(extremas - 1, sorted.length - 1)];
      minHigh = sorted[Math.max(sorted.length - extremas, 0)];
    }
    return processed.filter(a => a.y <= maxLow.y || a.y >= minHigh.y);
  }

  onZoomDomainChange = domain => this.setState(() => ({ domain: domain.x }));

  render() {
    const first = this.props.actions[0].timestamp;
    const last = this.props.actions[this.props.actions.length - 1].timestamp;

    const diff = last - first;
    const step = diff / this.props.trends.length;

    const tickValues = this.getTickValues();

    return (
      <VictoryChart
        theme={VictoryTheme.material}
        width={800}
        domain={{ x: [first, last], y: [0, 1] }}
      >
        <VictoryAxis
          scale="time"
          tickValues={tickValues}
          tickFormat={x => {
            return moment(x).format("LT");
          }}
        />
        {tickValues
          .slice(0, -1)
          .map(
            (value, i) =>
              console.log([{ x: value, y: 1 }, { x: value + step, y: 0 }]) || (
                <VictoryBar
                  key={i}
                  style={{ data: { fill: clrs[i], opacity: 0 } }}
                  data={[{ x: value + step / 2, y: 1 }]}
                  barRatio={10}
                  labels={datum => this.props.trends[i]}
                />
              )
          )}
        {this.props.participants.map((participant, i) => (
          <VictoryLine
            interpolation="basis"
            style={{
              data: { stroke: clrs[i] },
              parent: { border: "1px solid #ccc" }
            }}
            data={this.getDataForLine(this.props.actions, participant)}
            labelComponent={<LabelFace />}
            labels={datum => participant}
          />
        ))}
        {this.props.participants.map((participant, i) => (
          <VictoryScatter
            data={this.getDataForLine(this.props.actions, participant, 1, true)}
            dataComponent={<EmojiPoint />}
          />
        ))}
      </VictoryChart>
    );
  }
}
