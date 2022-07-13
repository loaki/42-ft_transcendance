import { formGroupClasses } from "@mui/material";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import "../../common/common.css";
import { API_HOST, API_GET_DATA } from "../../../global/constants"
import Button from '@mui/material/Button';
import BasicPopover from "../components/edit"

 //用fetch来通过id数字来获取数据
async function fetchData() {  //括号里setuser
  const res = await fetch(API_GET_DATA); 
  const { data } = await res.json();  //获取数据信息
  return data;   //setState(setUser) ;获取后端消息然后把新消息放进前段代码里显示出来
}

//上传修改 数据通过API 给后端
/* async function fetchSetData(data) {
   await fetch(后端APIAPI, {
     method:"PUT" //方式是 修改
     headers {          //格式
        'Content-type' : 'application/json'
     },
     body: JSON:.stringify( {data} )  //把文件转换为json格式放进去 传送
  })
 }*/

 

const ProfileBox = () => {

  const handleWindow = () => {
    //按login 时候处理
  
  };

  useEffect( () => {
    fetchData();  //如果有usestate 参数是setState
  },[])

  let imagesGif = require("../../common/images.gif");
  return (
    <Box
      className="profil"
      sx={{
         display: "flex",
         flexDirection: { xs: "column", md: "row" },
         alignItems: "center",
         bgcolor: "background.paper",
         overflow: 'hidden',
         borderRadius: "20px",
         boxShadow: 1,
         fontWeight: "bold",
      }}
    >
      <Box
        component="img"
        sx={{ height: 250, width: 250 }}
        alt="The photo from user."
        src={imagesGif}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          m: 3,
          minWidth: { md: 350 },
        }}
      >
        <Box component="span" sx={{ fontSize: 20 }}>
          user: XX
        </Box>
        <Box component="span" sx={{ fontSize: 20, mt: 2 }}>
          ages: X
        </Box>

        <Box
          component="span"
          sx={{ mt: 3, color: "primary.main", fontSize: 22 }}
        >
          WINS: 10
        </Box>
        <Box
          component="span"
          sx={{ mt: 2, color: "warning.main", fontSize: 22 }}
        >
          LOSES: 10
        </Box>

        <Box
          component="span"
          sx={{ mt: 2, color: "success.main", fontSize: 22 }}
        >
          score: 1200
        </Box>

        <Button key="edit" sx= {{ mt: 2}}>
          <BasicPopover />
        </Button>

      </Box>
    </Box>
  );
};

export default ProfileBox;


