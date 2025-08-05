'use client';

const FileUpload = ({ label, side, onChange, isHovered, onMouseEnter, onMouseLeave, error, accept }) => {
  return (
    <div className="mb-4">
      <label
        className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
          error ? 'border-red-400 bg-red-50' : isHovered ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${
          error ? 'bg-red-100 text-red-500' : isHovered ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className={`font-medium mb-1 transition-colors duration-300 ${
          error ? 'text-red-600' : isHovered ? 'text-blue-600' : 'text-gray-700'
        }`}>{label}</p>
        <p className="text-xs text-gray-500 mb-2">JPG, PNG, PDF (Max: 5MB)</p>
        <input
          type="file"
          name={side}
          onChange={onChange}
          className="hidden"
          accept={accept || "image/png, image/jpeg, application/pdf"}
        />
      </label>
      {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
    </div>
  );
};
export default FileUpload;