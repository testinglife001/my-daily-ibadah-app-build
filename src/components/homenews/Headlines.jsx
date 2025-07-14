import React from 'react';
import LoadingSpinner from 'react-spinners-components';
import { PropagateLoader, BeatLoader, PulseLoader } from 'react-spinners';
import Marquee from 'react-fast-marquee';
import { Link } from 'react-router-dom';

const Headlines = () => {
  const head = [
    { title: 'text title one for the headlines.' },
    { title: 'text title two for the headlines.' },
    { title: 'text title three for the headlines.' },
    { title: 'text title four for the headlines.' },
    { title: 'text title five for the headlines.' },
    { title: 'text title six for the headlines.' },
    { title: 'text title seven for the headlines.' },
    { title: 'text title eight for the headlines.' }
  ];

  return (
    <div className="headline-wrapper bg-white shadow d-flex flex-wrap">
      <div className="headline-label position-relative">
        <div className="px-3 px-md-4 py-2 d-flex align-items-center gap-2">
          <LoadingSpinner type="Ripple" colors={['#800000', '#c80000']} size="30px" />
          <h2 className="text-dark fw-semibold fs-5 mb-0">Headlines</h2>
        </div>
      </div>

      <div className="flex-grow-1 d-flex align-items-center">
        <Marquee>
          {head.map((h, i) => (
            <Link
              key={i}
              to="#"
              className="headline-link text-decoration-none text-dark fw-semibold px-4 small"
            >
              {h.title}
            </Link>
          ))}
        </Marquee>
      </div>

      <div className="w-100 text-center py-2">
        
        <PulseLoader />
      </div>
    </div>
  );
};

export default Headlines;
