type Props = {
  Component: React.FC<any>;
  isOpen: boolean;
  onClose: () => void;
  componentProps?: any;
  header?: string;
  className?: string;
};

const ExternalControlledModal: React.FC<Props> = ({ Component, isOpen, onClose, componentProps, header, className }) => {
  const modalWrapperClasses = "absolute top-0 left-0 w-full  z-[9999] bg-black/50 px-4 py-[5vh] min-h-screen";
  const modalContentClasses = "relative bg-bg text-text shadow shadow-border/40 rounded-2xl max-w-[60vw] overflow-hidden mx-auto";
  return (
    <>
      {isOpen && (
        <div
        className={modalWrapperClasses}
          onMouseDown={(e) => { if (e.target === e.currentTarget) { onClose() } }}
        >
          <div className={`${modalContentClasses} ${className || ""}`}>
            {header && (<h4 className="bg-text text-bg text-start font-medium p-4 px-10">{header}</h4>)}
            <div className="p-6"><Component {...componentProps} /></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExternalControlledModal;
