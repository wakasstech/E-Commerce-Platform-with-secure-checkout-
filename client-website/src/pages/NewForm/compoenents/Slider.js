import React from 'react';
import Slider from 'react-slick';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const mockData = [
  {
    name: "Robin Lambert",
    role: "Real Estate Agent",
    description: "I recently sold my home through [Platform Name], .",
    imageUrl: "https://cdn.pixabay.com/photo/2022/09/08/15/16/cute-7441224_640.jpg"
  },
  {
    name: "Robin Lambert",
    role: "Real Estate Agent",
    description: "I recently sold my home through [Platform Name], .",
    imageUrl: "https://cdn.pixabay.com/photo/2022/09/08/15/16/cute-7441224_640.jpg"
  },
  {
    name: "Robin Lambert",
    role: "Real Estate Agent",
    description: "I recently sold my home through [Platform Name], .",
    imageUrl: "https://cdn.pixabay.com/photo/2022/09/08/15/16/cute-7441224_640.jpg"
  },
];

const TestimonialsSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
  };

  return (
    <Slider {...settings} >
      {mockData.map((item, index) => (
        <Card key={index} sx={{ display: 'flex', alignItems: 'center', padding: 2, maxWidth: 600, margin: 'auto', backgroundColor: '#5C5C5C', color: '#fff',  }}>
          <Avatar alt={item.name} src={item.imageUrl} sx={{ width: 80, height: 80, marginRight: 2 }} />
          <CardContent>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              {item.description}
            </Typography>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              {item.name}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ color: '#bbb' }}>
              {item.role}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Slider>
  );
};

export default TestimonialsSlider;