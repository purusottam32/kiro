import React from 'react'
import {Suspense} from 'react'
import {BarLoader} from 'react-spinners'

const ProjectLayout = async ({children}: {children: React.ReactNode}) => {
  return (
    <div className="mx-auto">
      <Suspense fallback={<span className="flex justify-center mt-10">Loading Projects...</span>}>
        {children}
      </Suspense>
    </div>
  );
};

export default ProjectLayout