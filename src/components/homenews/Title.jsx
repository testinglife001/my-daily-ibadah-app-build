import React from 'react';

const Title = ({ title }) => {
  return (
    <div className="section-title position-relative ps-3 fw-bold fs-5 text-dark">
      {title}
    </div>
  );
};

export default Title;
