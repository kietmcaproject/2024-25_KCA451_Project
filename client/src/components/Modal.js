// client/src/components/Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button onClick={handleClose} className="close-button">⊗</button>
      </section>
    </div>
  );
};

export default Modal;
