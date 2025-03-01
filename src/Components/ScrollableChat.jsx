import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./Config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  // const { user } = ChatState();
  // console.log("this is message ===>",messages)

  const userd = localStorage.getItem('user')
  const user=JSON.parse(userd)

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>

            {console.log("this i m =========>", m)}
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}

              {console.log("this is content", m.content)}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;