import { useState, useContext } from "react";
import "../common/common.css";
import { ResponsiveAppBar } from "./components/appBar";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../common/route";
import Edit from "../common/pp2.gif";

const HanldleButton = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useContext(MyContext);

  const handleLoginClick = () => {
    //按login 时候处理
    setIsLogin(true);
    navigate("/signup");
  };

  return (
    <div className="div">
      {
        <button className="box" onClick={handleLoginClick}>
          Login with 42
        </button>
      }
    </div>
  );
};

let sectionStyle = {
  backgroundImage: `url(${Edit})`,
};

// const data = {
//   username: "xuexue"
// }

// JSON.stringify(data)

const Home = () => {
  return (
    <div className="image" style={sectionStyle}>
      <ResponsiveAppBar />
      <HanldleButton />
    </div>
  );
};


export default Home;

