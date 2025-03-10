import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box,
  Divider
} from '@mui/material';
import { styled } from '@mui/system';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#181818',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const LoginButton = styled(Button)({
  color: '#ffffff',
});

const RequestButton = styled(Button)({
  backgroundColor: '#ff6600',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#e65c00',
  },
});

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static" boxShadow={0}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 5, py: 1 }}>
        <img src="https://www.sold4u2day.co.uk/images/logo/PNG%20-%20SOLD4U2day%20-%20logo%20-%20single%20colour.png" alt="Sold Icon" style={{ width: '80px', height: '80px' }} />
        <Typography variant="body2" sx={{ color: '#ffffff' }}>
      <Box component="span" >
        Tel: <span style={{ color: 'orange' }}>020 8000 8222</span>
      </Box>
      <Box component="span" sx={{ mx: 2 }}> {/* Adjust mx value for spacing */}
        |
      </Box>
      <Box component="span" >
        Upcoming Auction: <span style={{ color: 'orange' }}>View Lots </span>
      </Box>
    </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#ff6600', margin: '10px 0px' }} />
      <Toolbar sx={{ justifyContent: 'space-between', boxShadow: 0 }}>
        <Box sx={{ display: 'flex', px: 1 }}>
          <NavButton>Home</NavButton>
          <NavButton
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleClick}
          >
            Auction
          </NavButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Auction 1</MenuItem>
            <MenuItem onClick={handleClose}>Auction 2</MenuItem>
          </Menu>
          <NavButton
            endIcon={<KeyboardArrowDownIcon />}
          >
            Auction Guides
          </NavButton>
          <NavButton
            endIcon={<KeyboardArrowDownIcon />}
          >
            Services
          </NavButton>
          <NavButton>About Us</NavButton>
        </Box>
        <Box  px= {2.5} >
          <LoginButton sx={{ mr: 1 }}>Login</LoginButton>
          <RequestButton variant="contained">Request Valuation</RequestButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;