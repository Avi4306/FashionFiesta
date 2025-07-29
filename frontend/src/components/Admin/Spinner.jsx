import React from 'react';

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-[200px]">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#aa5a44]"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;