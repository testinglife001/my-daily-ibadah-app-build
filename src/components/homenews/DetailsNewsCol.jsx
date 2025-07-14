import React from 'react';
import Title from './Title';
import SimpleDetailsNewsCard from './SimpleDetailsNewsCard';
import NewsCard from './NewsCard';

const DetailsNewsCol = () => {
  return (
    <div className="w-100 d-flex flex-column gap-3 ps-2">
      <Title title="Education" />

      <div className="d-grid gap-4">
        <SimpleDetailsNewsCard type="details-news" />
      </div>

      <div className="d-grid gap-3 mt-4">
        {[1, 2, 3, 4].map((_, i) => (
          <NewsCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default DetailsNewsCol;
