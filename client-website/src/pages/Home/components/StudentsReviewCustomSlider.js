import React from "react";
import Slider from "react-slick";
import { Container, Typography, Card, CardContent, Avatar } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './StudentsReviewCustomSlider.css'; // Import the custom CSS
import { ArrowForwardIos, KeyboardArrowRight } from "@mui/icons-material";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
    className={`${className} custom-next-arrow`}
      style={{ ...style, display: 'block', background: 'rgb(27 59 88)', borderRadius: '30%', padding: '10px' }}
      onClick={onClick}
    >
      <KeyboardArrowRight style={{ color: '#fff' }} />
    </div>
  );
};
   const testimonials = [
  {
    name: "Ismaeel Ameen",
    text: "To stay at the leading edge of IT innovation, your team needs to regularly reinvent its skillset. With Udemy Business, I can give my team the space to learn and take the initiative. It means we can produce higher quality work more quickly.",
    avatar: "https://i.pinimg.com/736x/93/f4/0e/93f40ec756290812571be534e12bcfe7.jpg",
    title: "Head of Data Engineering",
    company: "Pvt Ltd."
  },
  {
    name: "Student B",
    text: "The teachers are very supportive and knowledgeable.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCaWuwwn485DwYl8i29vdAiOfwpoB7ixPmGwAyHMvTObewEa9-Siiw5VyRUkDonJPq58&usqp=CAU",
    title: "Student",
    company: "University"
  }
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
 
  autoplay: false,
  autoplaySpeed: 2000,
};



function CustomSlider() {
  return (
    <Container maxWidth="lg" style={{ marginTop: '40px', marginBottom: '40px' }}>
    <Slider {...settings} className="slider-container">
      {testimonials.map((testimonial, index) => (
        <div key={index}>
          <Card className="testimonial-card" style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667ecd, rgb(3 17 30))'
          }}>
            <Avatar
              alt={testimonial.name}
              src={testimonial.avatar}
              className="testimonial-avatar"
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto',
                marginTop: '20px'
              }}
            />
            <CardContent style={{ color: 'white', textAlign: 'center' }}>
              <Typography variant="body1" className="testimonial-text" style={{ fontStyle: 'italic', marginBottom: '20px' }}>
                {testimonial.text}
              </Typography>
              <Typography variant="h6" component="div" className="testimonial-name" style={{ fontWeight: 'bold' }}>
                {testimonial.name}
              </Typography>
              <Typography variant="subtitle2" color="inherit">
                {testimonial.title}
              </Typography>
              <Typography variant="subtitle2" color="inherit">
                {testimonial.company}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  </Container>
  );
}

export default CustomSlider;
