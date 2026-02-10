import React from 'react'
import {Suspense} from 'react'
import {BarLoader} from 'react-spinners'

const ProjectLayout = async ({children}: {children: React.ReactNode}) => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <BarLoader color="#0A5BFF" />
            <p className="text-slate-400 mt-4 font-medium">Loading Projects...</p>
          </div>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
};

export default ProjectLayout