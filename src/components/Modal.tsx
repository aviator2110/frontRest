type ModalProps = {
    isOpen: boolean;
    message: string;
    onClose: () => void;
};

export function Modal({ isOpen, message, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <p>{message}</p>
                <button className="primary-button" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}