import React from 'react';
// eslint-disable-next-line no-unused-vars
import { nanoid } from 'nanoid';
// eslint-disable-next-line no-unused-vars
import { Carousel, Image } from 'antd';
import 'antd/es/image/style/index.css';
import { ImageList, ImageListItem } from '@mui/material';

export default function MyCarousel(props) {
  // eslint-disable-next-line no-unused-vars,react/prop-types
  const { images } = props;

  return (
    <>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {/* eslint-disable-next-line react/prop-types */}
        {images.map(item => (
          <ImageListItem key={nanoid()}>
            <img src={`${item}`} style={{ width: 164, height: 164 }} loading='lazy' alt='' />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
