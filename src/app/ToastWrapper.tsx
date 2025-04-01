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
      toastClassName={"text-sm font-md block min-w-[250px] relative flex px-4 py-2 rounded-md justify-between cursor-pointer bg-[#262626] text-white shadow-lg"}
      progressClassName={'bg-[#FCD618]'}
    />
  );
};

export default ToastWrapper;
