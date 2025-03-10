import "./Desktop.css";
import React, { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
 
  Typography,
} from "@mui/material";



const DesktopNavigation = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  let authToken = localStorage.getItem("Authorization");

  const handleLogOut = () => {
    localStorage.clear();
    navigate("/admin/login");
    window.location.reload();
  };

  const handleClickOpen = ( ) => {
    setOpenAlert(true);
  }
  const handleClose = ( ) => {
    setOpenAlert(false);
  }

  return (
    <>
      <nav className="nav">
        <div className="logo">
          <span>Arshy Muala</span>
        </div>
        <div className="nav-items">
          <ul className="nav-items">
            <li
              style={{
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
              }}
              onClick={ handleClickOpen}
            >
              <Button
                variant="contained"
                className="nav-icon-span"
                sx={{ marginBottom: 1 }}
                endIcon={<FiLogOut />}
              >
                <Typography variant="button"> Logout</Typography>
              </Button>
            </li>
          </ul>
        </div>
      </nav>
      <Dialog
        open={openAlert}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent
          sx={{
            width: { xs: 280, md: 350, xl: 400 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6"> Do You Want To Logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Link to="/">
            <Button
              variant="contained"
              endIcon={<FiLogOut />}
              color="primary"
              onClick={handleLogOut}
            >
              Logout
            </Button>
          </Link>
          <Button
            variant="contained"
            color="error"
            endIcon={<AiFillCloseCircle />}
            onClick={ handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DesktopNavigation;
