import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import paymentIcon from "../../assests/icons/payments.png";
import "./Navbar.css";
import {
  AccountCircle,
  Person3Outlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import logo from "../../assests/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../globalStore/Slices/AuthSlice";
import axios from "axios";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function Navbar() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [userName, setUserName] = React.useState("");
  console.log(userName, "username");
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    // dispatch(logout());
    // navigate("/");
  };
  const handleLogout = () => {
    setAnchorElUser(null);
    dispatch(logout());
    navigate("/");
  };

  React.useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    if (token) {
      try {
        const response = await axios.get("http://localhost:6464/user/getuser", {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });
        setUserName(response.data.data.username);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }
  };

  return (
    <>
      <AppBar
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          backgroundColor: "#F6E1C3",
        }}
      >
        <Container maxWidth="xl" sx={{ background: "#F6E1C3" }}>
          <Toolbar
            disableGutters
            sx={{
              pr: { xs: 0, md: 11, alignItems: "center" },
            }}
          >
            {/* <AdbIcon sx={{  }} /> */}
            {/* <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#AF3B3F',
              textDecoration: 'none',
            }}
          > 
            ARSHY MOLA
          </Typography>  */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: "160px",
                  height: "110px", // Adjust the height as needed
                  // marginRight: '20px', // Add space between logo and text or menu
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              {/* Menu Icon Button */}
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon sx={{ color: "black" }} />
              </IconButton>

              {/* Navigation Menu */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {/* Menu Items */}
                {[
                  "HOME",
                  "MEN",
                  "WOMEN",
                  "COLLECTIONS",
                  "ABOUT US",
                  "CONTACT US",
                ].map((page, index) => (
                  <MenuItem key={index} onClick={handleCloseNavMenu}>
                    <NavLink
                      to={`/${page.replace(" ", "").toLowerCase()}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      <Button sx={{ color: "#4A403A", fontWeight: "bold" }}>
                        {page}
                      </Button>
                    </NavLink>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
            {/* <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#AF3B3F',
                            textDecoration: 'none',
            }}
          >
            ARSHY MOLA
          </Typography>  */}

            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                  justifyContent: "center",
                  marginRight: 3,
                  gap: 8,
                },
              }}
            >
              <NavLink
                to="/"
                activeClassName="active"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  // key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#4A403A",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  HOME
                </Button>
              </NavLink>
              <NavLink
                to="/men"
                activeClassName="active"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  // key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#4A403A",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  MEN
                </Button>
              </NavLink>

              <NavLink
                to="/women"
                activeClassName="active"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  // key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#4A403A",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  WOMEN
                </Button>
              </NavLink>
              <NavLink
                to="/collections"
                activeClassName="active"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  // key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#4A403A",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  COLLECTION
                </Button>
              </NavLink>

              <NavLink
                to="/aboutUs"
                activeClassName="active"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  // key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#4A403A",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  ABOUT US
                </Button>
              </NavLink>

              <NavLink
                to="/contactUs"
                activeClassName="active"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Button
                  // key={page}
                  // onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#4A403A",
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  CONTACT
                </Button>
              </NavLink>
            </Box>

            <>
              <Box sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
                <IconButton sx={{ p: 0 }} onClick={() => navigate("/carts")}>
                  <ShoppingBagOutlined style={{ color: "red" }} />
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    {" "}
                    Carts
                  </span>
                </IconButton>
              </Box>
            </>

            {/* 
           {
            !token && (
              <>
              <Box sx={{ flexGrow: 0 }}>
            
             
              <Tooltip title="SignIn">
          <Typography onClick={()=> navigate("/signin")} 
          sx={{ 
            p: 0, 
      fontSize: 16,
      fontStyle: 'italic',
      color: '#716759',
      fontWeight: 600,
      marginLeft: '2px', 
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', 
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }}>
      SignIn
    </Typography>
</Tooltip>
            
          </Box>

          <Box sx={{ flexGrow: 0, ml: 3 }}>
          <Tooltip title="SignUp">
          <Typography  onClick={()=> navigate("/signup")}  sx={{
      fontSize: 16,
      fontStyle: 'italic',
      color: '#716759',
      fontWeight: 600,
      marginLeft: '2px', 
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', 
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }}>
      SignUp
    </Typography>
</Tooltip>

           
           
          </Box>
          </>
            )
          } */}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
export default Navbar;
