type Props = {
  Component: React.FC<any>;
  isOpen: boolean;
  onClose: () => void;
  componentProps?: any;
  header?: string;
  className?: string;
};

const ExternalControlledModal: React.FC<Props> = ({ Component, isOpen, onClose, componentProps, header, className }) => {
  const modalWrapperClasses = "fixed inset-0 z-[3000] flex items-center justify-center bg-black lg:bg-black/50";
  const modalContentClasses = "relative bg-light shadow-lg shadow-dark/20 flex flex-col lg:rounded-xl min-w-[40vw] min-h-[40vh] overflow-hidden ";
  return (
    <>
      {isOpen && (
        <div className={modalWrapperClasses} onClick={onClose}>
          <div className={`${modalContentClasses} ${className || ""}`} onClick={e => e.stopPropagation()}>
            {header && <h5 className="bg-arya1/80 text-start font-semibold py-2 px-8 uppercase">{header}</h5>}
            <Component {...componentProps} />
          </div>
        </div>
      )}
    </>
  );
};

export default ExternalControlledModal;
