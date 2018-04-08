import React from "react";
import Trends from "./Trends";
import styles from "./Trends.css";

export default class TrendsLoader extends React.Component {
  state = {
    emoji: null,
    sentiment: null,
    trends: null,
    actions: null
  };

  componentDidMount() {
    const MercuryViewer = window.require("MercuryViewer");
    const MercuryParticipants = window.require("MercuryParticipants");
    requireLazy(["MessengerGraphQLThreadFetcher.bs"], MGTF => {
      MGTF.fetchAll(MercuryViewer.getID().split(":")[1], [
        {
          id: this.props.thread,
          isCanonical: false,
          limit: 10000,
          loadReadReceipts: false,
          timestamp: Date.now()
        }
      ])
        .catch(e => console.log(e))
        .then(r => {
          const actions = r[0].actions
            .filter(action => action.body)
            .map(action => ({
              author: action.author,
              body: action.body,
              timestamp: action.timestamp
            }));

          const bodies = actions.map(a => a.body);

          this.setState(() => ({ actions }));

          chrome.runtime.sendMessage(
            this.props.extensionId,
            {
              type: "sentiment",
              data: bodies
            },
            res => {
              this.setState(() => ({
                sentiment: res
              }));
            }
          );

          chrome.runtime.sendMessage(
            this.props.extensionId,
            {
              type: "emojis",
              data: bodies
            },
            res => {
              this.setState(() => ({
                emoji: res
              }));
            }
          );

          chrome.runtime.sendMessage(
            this.props.extensionId,
            {
              type: "trends",
              data: bodies
            },
            res => {
              this.setState(() => ({
                trends: res
              }));
            }
          );
        });
    });
  }

  render() {
    const XUISpinner = window.require("XUISpinner.react");
    if (this.state.emoji && this.state.sentiment && this.state.trends) {
      return (
        <div className={styles.trendsContainer}>
          <Trends
            thread={this.props.thread}
            participants={this.props.participants}
            trends={this.state.trends}
            actions={this.state.actions.map((action, i) => ({
              ...action,
              emoji: this.state.emoji[i],
              sentiment: this.state.sentiment[i],
              timestamp: action.timestamp
            }))}
          />
        </div>
      );
    }
    return (
      <div className={styles.trendsContainer}>
        <div className={styles.centered}>
          <XUISpinner background="light" size="large" />
        </div>
      </div>
    );
  }
}
