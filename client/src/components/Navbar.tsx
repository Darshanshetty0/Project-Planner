import React from 'react';
import { AppBar, Typography, IconButton} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface NavbarProps {
  username: string | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
      <AppBar className="navbar" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", pl: 2, pr: 2 }}>
          <Typography variant="h6">Logo</Typography>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Typography variant="h6" sx={{ margin: 0 }}>{username}</Typography>
              <IconButton color="inherit">
                  <AccountCircleIcon />
              </IconButton>
              <Typography variant="button" sx={{ backgroundColor: "red", color: "white", padding: "5px", borderRadius: "5px", cursor: "pointer" }} onClick={onLogout}>
                  Logout
              </Typography>
          </div>
      </AppBar>
  );
};


export default Navbar;
