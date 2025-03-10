import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { useTimer } from 'react-timer-hook';
import countdownStyles from './styles'; 


// Countdown Timer Component
const CountdownTimer = ({  }) => {
   const isName = "waqas";
  return (
    <Box mt={3} mb={2} display="flex" >
      <Box mx={1}  sx={(theme) => ({...countdownStyles(theme).countDownBox })} >
        <Typography variant="h5"
         sx={(theme) => ({
          ...countdownStyles(theme).timerText, // color: isName ? 'red' : countdownStyles(theme).timerText.color, // Conditionally override the color
          })}
          >3</Typography>
        <Typography variant="body2" sx={(theme) => ({...countdownStyles(theme).labelText})}>Day</Typography>
      </Box>
      <Box mx={1} sx={(theme) => ({...countdownStyles(theme).countDownBox })} >
        <Typography variant="h5" sx={(theme) => ({...countdownStyles(theme).timerText})}>8</Typography>
        <Typography variant="body2" sx={(theme) => ({...countdownStyles(theme).labelText})}>Hour</Typography>
      </Box>
      <Box mx={1} sx={(theme) => ({...countdownStyles(theme).countDownBox })} >
        <Typography variant="h5" sx={(theme) => ({...countdownStyles(theme).timerText})}>30</Typography>
        <Typography variant="body2" sx={(theme) => ({...countdownStyles(theme).labelText})}>Minute</Typography>
      </Box>
      <Box mx={1} sx={(theme) => ({...countdownStyles(theme).countDownBox })} >
        <Typography variant="h5" sx={(theme) => ({...countdownStyles(theme).timerText})}>14</Typography>
        <Typography variant="body2" sx={(theme) => ({...countdownStyles(theme).labelText})}>Second</Typography>
      </Box>
    </Box>
  );
};

export default CountdownTimer;