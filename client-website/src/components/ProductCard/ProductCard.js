import React from "react";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
} from "@mui/material";
import { StyledCard, StyledMedia, ProductTitle, Price } from "./ProductStyled";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ title, price, discountPrice, image, rating, _id }) => {
  const navigate = useNavigate();

  const handleClickCard = () => {
    navigate("/productSection", { state: { _id, title, price, image } });
  };

  return (
    <StyledCard isName={"waqass"} onClick={handleClickCard}>
      <StyledMedia image={image} title={title} />
    
      <CardContent sx={{}}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1,
            color: "#F5C64D",
          }}
        >
          <Rating
            name="half-rating-read"
            defaultValue={rating}
            precision={0.5}
            readOnly
          />
        </Box>
        <Typography
          variant="h6"
          color="#4A403A"
          textAlign={"center"}
          sx={{
            fontFamily: "Frank Ruhl Libre",
            fontSize: 18,
            fontWeight: 600,
            lineHeight: "10px",
            color: "#4A403A",
            letterSpacing: "2%",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="#4A403A"
          textAlign={"center"}
          sx={{
            fontFamily: "Lato",
            fontSize: 16,
            fontWeight: 500,
            lineHeight: "40px",
            color: "#4A403A",
            letterSpacing: "2%",
          }}
        >
          {price}{" "}
          <span style={{ textDecoration: "line-through" }}>
            PKR{discountPrice}
          </span>
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard;
