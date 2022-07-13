import { ResponsiveAppBar } from "../home/components/appBar";
import Background from "../common/pp2.gif";

let img = {
  backgroundImage: `url(${Background})`,
};
// implements

const Chat = () => {
  return (
    <div className="image" style={img}>
      <ResponsiveAppBar />
      <div color="white">this is page Chat</div>
    </div>
  );
};

export default Chat;
