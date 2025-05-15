import React from 'react';
import FileUpload from '@/components/FileUpload';
const Start: React.FC = () => {

  return (
  <div className="flex flex-col items-center justify-center w-[400px] h-[400px] border border-black rounded-lg">
        <div className="    ">
            <h1 className="text-2xl font-bold">Metastrip</h1>
        </div>
        <div className="">
            <FileUpload onFileSelect={() => {}} />
        </div>
  </div>
  );
};

export default Start;