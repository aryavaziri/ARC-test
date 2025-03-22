"use client";
import { useEffect, useState } from "react";
import { MdAddCircle } from "react-icons/md";

type ComponentProps = {
  handleClose: () => void;
};

type Props = {
  Component: React.FC<ComponentProps>;
  ModalButton?: React.FC;
  header?: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
};

export default function CustomModal({ Component, header, ModalButton, isOpen, onClose, className }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose(); // Call parent onClose if provided
  };

  const defaultModalClasses = "fixed top-0 left-0 h-screen w-screen flex items-start justify-center bg-black/50 z-[9999] backdrop-blur-xs";
  const modalContentClasses = "relative bg-bg text-text shadow shadow-light rounded-2xl max-w-[60vw] max-h-[80vh] min-h-[40vh] overflow-y-auto mt-[10vh]";

  useEffect(() => {
    // console.log(isOpen);
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        {ModalButton ? (
          <ModalButton />
        ) : (
          <div className="rounded btn btn-primary flex justify-center gap-2 items-center">
            <MdAddCircle className="text-2xl text-center" />
            {header && <div>{header}</div>}
          </div>
        )}
      </div>
      {open && (
        <div className={defaultModalClasses} onClick={handleClose}>
          <div className={`${modalContentClasses} ${className || ""}`} onClick={e => e.stopPropagation()}>
            {header && <h4 className="bg-text text-bg text-start text-light font-medium p-4 px-10">{header}</h4>}
            <Component handleClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
}
