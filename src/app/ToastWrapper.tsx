'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastWrapper = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      toastClassName={() =>
        "relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-[#262626] text-white shadow-lg"
      }
      // bodyClassName={() => "text-sm font-white font-md block p-5"}
      progressClassName={'bg-[#FCD618]'}
    />
  );
};

export default ToastWrapper;
