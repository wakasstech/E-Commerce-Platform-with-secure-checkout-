// StyledComponents.js
import { styled } from '@mui/material/styles';
import { Card, CardMedia, Typography } from '@mui/material';

export const StyledCard = styled(Card)(({ theme, isName }) => ({
    cursor: 'pointer',
    margin: 'auto',
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: {
      maxWidth: 265, // This will allow it to take full width on medium screens and above
    },
    background: isName === "waqas" ? 'red' : 'transparent',
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      transform: "scale(1.03)",
    },
   
    // [theme.breakpoints.up('xs')]: {
    //   backgroundColor: 'lightgreen', // Applies on small screens and up
    // },
    // [theme.breakpoints.up('sm')]: {
    //   backgroundColor: 'lightgreen', // Applies on small screens and up
    // },
    // [theme.breakpoints.up('md')]: {
    //   backgroundColor: 'lightcoral', // Applies on medium screens and up
    // },
    // [theme.breakpoints.up('lg')]: {
    //   backgroundColor: 'lightgoldenrodyellow', // Applies on large screens and up
    // },
     // [theme.breakpoints.up('xl')]: {
    //   backgroundColor: 'lightgoldenrodyellow', // Applies on large screens and up
    // },
  }));

export const StyledMedia = styled(CardMedia)({
  height: 300,
});

export const ProductTitle = styled(Typography)({
  fontWeight: 'bold',
});

export const Price = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
}));
