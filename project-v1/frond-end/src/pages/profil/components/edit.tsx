import * as React from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from "react-router-dom";
import { ResponsiveAppBar } from "../../home/components/appBar"
import Background from "../../common/pp2.gif";

let img = {
  backgroundImage: `url(${Background})`,
};

export const EditPage = () => {                  //修改页面
	return (
		<div className="image" style={img}>
		 	<ResponsiveAppBar />
			 page setting  
		</div>
	)

}


const Edit = () => {
	const navigate = useNavigate();

	const handleSettings = () => {
		navigate("/profile/edit");
	}
	

	return (
		<div>
			<Button color="inherit" variant="contained" onClick={handleSettings}>
				<EditIcon></EditIcon>settings
			</Button>
		</div>
	)
}


export default Edit;

// export default function BasicPopover() {
//   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? 'simple-popover' : undefined;

//   return (
//     <div>
//       <Button aria-describedby={id} color="inherit" variant="contained" onClick={handleClick}>
//         <EditIcon></EditIcon>settings
//       </Button>
//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: 'bottom',
//           horizontal: 'left',
//         }}
//       >
//          <Typography sx={{ p: 20 }}>
//           The content of the Popover.
//          </Typography> 
//       </Popover>
//     </div>
//   );
// }
