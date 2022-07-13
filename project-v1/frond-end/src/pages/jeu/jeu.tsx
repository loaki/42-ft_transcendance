import { useLocation } from "react-router-dom";
import { ResponsiveAppBar } from "../home/components/appBar";
import Background from "../common/pp2.gif";
//useEffect 当你想在什么条件下要变化什么样子的时候使用

let img = {
  backgroundImage: `url(${Background})`,
};


const Jeu = () => {
  return (
    <div  className="image" style={img}>
      <ResponsiveAppBar />
      <div>this is page jeu </div>
    </div>
  );
};

export default Jeu;
