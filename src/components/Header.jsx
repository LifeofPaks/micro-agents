import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import { FaSignOutAlt } from "react-icons/fa";

const Header = ({user}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

const getInitials = (fullName) => {
  if (!fullName) return "";

  const names = fullName.trim().split(" ");
  const firstInitial = names[0]?.[0] || "";
  const lastInitial = names.length > 1 ? names[names.length - 1][0] : "";

  return (firstInitial + lastInitial).toUpperCase();
};
  
  const initials = getInitials(user?.fullName);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("User logged out");
    // TODO: add your logout logic here
    handleClose();
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light w-100">
        <div className="container px-3">
          {/* Brand */}
          <a
            className="navbar-brand font-extrabold !text-[28px] lg:w-full text-center"
            href="./index.html"
          >
            Micro Agents
          </a>

          {/* User Dropdown */}
          <div className="ms-auto">
            <Avatar
              sx={{
                bgcolor: "#1e293b",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={handleClick}
            >
              {initials}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  bgcolor: "#1e293b",
                  color: "white",
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 150,
                },
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon sx={{ color: "white", minWidth: "32px" }}>
                  <FaSignOutAlt size={16} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
