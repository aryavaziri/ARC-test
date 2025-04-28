type Props = {
  Component: React.FC<any>;
  isOpen: boolean;
  onClose: () => void;
  componentProps?: any;
  header?: string;
  className?: string;
};

const ExternalControlledModal: React.FC<Props> = ({ Component, isOpen, onClose, componentProps, header, className }) => {
  const modalWrapperClasses = "fixed top-0 left-0 min-h-screen w-screen flex items-start justify-center bg-black/50 z-[9999] backdrop-blur-xs";
  const modalContentClasses = "relative bg-bg text-text shadow shadow-light rounded-2xl max-w-[60vw] min-h-[40vh] overflow-y-auto mt-[10vh]";
  return (
    <>
      {isOpen && (
        <div className={modalWrapperClasses} onClick={onClose}>
          <div className={`${modalContentClasses} ${className || ""}`} onClick={e => e.stopPropagation()}>
          {header && <h4 className="bg-text text-bg text-start font-medium p-4 px-10">{header}</h4>}
          <Component {...componentProps} />
          </div>
        </div>
      )}
    </>
  );
};

export default ExternalControlledModal;
