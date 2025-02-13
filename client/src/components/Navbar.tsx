import React from 'react';
import { AppBar, Toolbar, Typography, IconButton} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface NavbarProps {
  username: string | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <header>
      <AppBar className='navbar' sx={{ padding:'0'}}>
        <Toolbar>
          <div>
            <Typography variant="h6" sx={{ flexShrink: 0, mr: 2 }}>
              Logo
            </Typography>
          </div>
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'absolute', right:'10px'}}>
            <h5 style={{margin: 0}}>{username}</h5>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="button" sx={{backgroundColor: 'red', color: 'white', padding: '5px', borderRadius: '5px'}} onClick={onLogout}>Logout</Typography>   
          </div>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Navbar;
