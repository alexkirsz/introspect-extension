import styles from "./ChatTabComposer.css";
import chroma from "chroma-js";
import debounce from "lodash.debounce";

export default (req, ChatTabComposer$, extensionId) => {
  const React = req("React");

  class ChatTabComposer extends React.Component {
    state = {
      sentiment: 0.5
    };

    attachComposer = composer => {
      if (composer !== null) {
        this.composer = composer;
        this.onSend = composer.onSend.bind(composer);
        this.uploadURL = composer.uploadURL.bind(composer);
        this.isUploading = composer.isUploading.bind(composer);
        this.getInput = composer.getInput.bind(composer);
        this.replyToMention = composer.replyToMention.bind(composer);
      }
    };

    requestSentiment = debounce(
      () => {
        chrome.runtime.sendMessage(
          extensionId,
          {
            type: "sentiment",
            data: [this.props.defaultText]
          },
          res => {
            this.setState(() => ({
              sentiment: res[0]
            }));
          }
        );
      },
      200,
      { trailing: true }
    );

    componentDidUpdate(prevProps) {
      if (prevProps.defaultText !== this.props.defaultText) {
        this.requestSentiment();
      }
    }

    render() {
      let color = "#616cfb";
      if (this.state.sentiment < 0.5) {
        color = chroma.mix(
          "#616cfb",
          "#fb6161",
          (0.5 - this.state.sentiment) / 0.5,
          "rgb"
        );
      } else if (this.state.sentiment >= 0.5) {
        color = chroma.mix(
          "#616cfb",
          "#61fb70",
          (this.state.sentiment - 0.5) / 0.5,
          "rgb"
        );
      }

      return (
        <div className={styles.composer}>
          <div className={styles.bar} style={{ backgroundColor: color }} />
          <ChatTabComposer$ ref={this.attachComposer} {...this.props} />
        </div>
      );
    }
  }
  return ChatTabComposer;
};
