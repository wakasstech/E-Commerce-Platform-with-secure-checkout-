// styles.js
const countdownStyles  = (theme) => ({
  countDownBox: {
      backgroundColor: 'white',
      padding: '10px 20px',
       [theme.breakpoints.down('md')]: {
        padding: '5px 4px',
        },
    },
    timerText: {
      textAlign: 'center',
        color: '#4A403A',
        fontSize: '42px',
        fontFamily: 'Lato',
        lineHeight: '50.4px',
        fontWeight: 900,
        letterSpacing: '2%',
        [theme.breakpoints.down('md')]: {
          fontSize: '25px',
        },
      },
    labelText: {
      color: '#4A403A',
      textAlign: 'center',
      fontSize: '18px',
      fontFamily: 'Lato',
      lineHeight: '5.6px',
      fontWeight: 500,
      letterSpacing: '2%',
      [theme.breakpoints.down('md')]: {
        fontSize: '15px',
      },
    },
  
});
  
  export default countdownStyles;
  