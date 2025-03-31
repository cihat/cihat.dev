import React from 'react';

export const Box = ({ width = 0, height = 0, ...props }) => {
  return (
    <div
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'inline-block'
      }}
      {...props}
      className={props.className}
    >
      {props.children}
    </div>
  );
};
