import React from 'react';
    
export const CustomMessage = ({ message, onClose, onClick }) => {
    
      return (
        <div className={`fixed inset-0 flex justify-end mt-14 items-end z-50 m-14`}>
          <div
            className={`bg-blue-100 text-white-700 border-blue-500 border-2 border-solid rounded-lg p-4 max-w-xs w-full`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4.586l-1.707-1.707a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414L11 11.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium">{message}</p>
              </div>
                <button
                onClick={onClose}
                className="ml-4 text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                x
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    