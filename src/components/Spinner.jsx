import React from "react";

const Spinner = () => {
  return (
    <div>

      <div>

        <div className="text-center">

          

          <div className="spinner-border m-5 " role="status">
          </div>

          <h4 className="text-center">
              Please Wait ...
          </h4>
          <br/><br/><br/><br/>

          <div className="spinner-border text-primary mt-5 spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <br/><br/><br/>
          <div className="d-flex justify-content-center">
              <div className="spinner-grow text-primary"
                  role="status">
              </div>
              
              <span className='px-4' >
                  <h5>Processing</h5>
              </span>
              <div className="spinner-grow text-primary"
                  role="status">
              </div>
          </div>
          <br/>
          <br/>
          
          <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
              </div>
          </div>

        </div>
          
      </div>

    </div>
  );
};

export default Spinner;
