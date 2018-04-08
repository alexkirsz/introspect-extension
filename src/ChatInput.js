import styles from "./ChatInput.css";
import emojiCodes from "./emojiCodes";
import debounce from "lodash.debounce";
import TrendIcon from "./TrendIcon";
import TrendsLoader from "./TrendsLoader";

export default (req, ChatInput$, extensionId) => {
  const React = req("React");
  const EmojiImageURL = req("EmojiImageURL");
  const EmojiLikeConstants = req("EmojiLikeConstants");
  const Image = req("Image.react");
  const SimpleXUIDialog = req("SimpleXUIDialog");

  class ChatInput extends React.Component {
    state = {
      emojiScores: emojiCodes.map(() => 0)
    };

    attachInput = input => {
      if (input !== null) {
        this.input = input;
        this.onChange = input.onChange.bind(input);
        this.onReturn = input.onReturn.bind(input);
        this.getValue = input.getValue.bind(input);
        this.resetState = input.resetState.bind(input);
        this.onSend = input.onSend.bind(input);
        this.getValueFromEditorState = input.getValueFromEditorState.bind(
          input
        );
        this.getMentions = input.getMentions.bind(input);
        this.focus = input.focus.bind(input);
        this.insertEmoticon = input.insertEmoticon.bind(input);
        this.insertEmoji = input.insertEmoji.bind(input);
        this.appendText = input.appendText.bind(input);
        this.addMention = input.addMention.bind(input);
      }
    };

    requestEmojis = debounce(
      () => {
        chrome.runtime.sendMessage(
          extensionId,
          {
            type: "emojis",
            data: [this.props.defaultText]
          },
          res => {
            this.setState(() => ({
              emojiScores: res[0]
            }));
          }
        );
      },
      200,
      { trailing: true }
    );

    componentDidUpdate(prevProps) {
      if (prevProps.defaultText !== this.props.defaultText) {
        this.requestEmojis();
      }
    }

    render() {
      let scores = this.state.emojiScores.map((s, i) => [s, i]);
      scores.sort((a, b) => b[0] - a[0]);
      scores = scores.slice(0, 10).map(s => emojiCodes[s[1]]);
      return (
        <div className={styles.chatInput}>
          <ChatInput$ ref={this.attachInput} {...this.props} />
          <div className={styles.bottom}>
            <div className={styles.emojiList}>
              {scores.map(s => (
                <Image
                  alt={String.fromCodePoint(parseInt(s, 16))}
                  src={EmojiImageURL.getMessengerURL(
                    s,
                    EmojiLikeConstants.sizeMap.small
                  )}
                  className={styles.emoji}
                  onClick={() => this.insertEmoji([parseInt(s, 16)])}
                />
              ))}
            </div>
            <TrendIcon
              width="18px"
              height="18px"
              className={styles.trendIcon}
              onClick={() =>
                SimpleXUIDialog.showEx(
                  <TrendsLoader
                    thread={this.props.thread.thread_fbid}
                    participants={this.props.thread.participants}
                    extensionId={extensionId}
                  />,
                  "Trends",
                  null,
                  null,
                  {
                    width: 600
                  }
                )
              }
            />
          </div>
        </div>
      );
    }
  }
  return ChatInput;
};
