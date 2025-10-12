'use client';

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useRef,
	useEffect,
} from 'react';
import { createPortal } from 'react-dom';

interface ModalContextType {
	openModal: (content: ReactNode) => void;
	closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [modalContent, setModalContent] = useState<ReactNode | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const openModal = (content: ReactNode) => {
		setModalContent(content);
	};

	const closeModal = () => {
		setModalContent(null);
	};

	const contextValue = { openModal, closeModal };

	return (
		<ModalContext.Provider value={contextValue}>
			{children}
			{isMounted && modalContent
				? createPortal(
					<ModalBackdrop onClose={closeModal}>{modalContent}</ModalBackdrop>,
					document.getElementById('modal-root')!
				)
				: null}
		</ModalContext.Provider>
	);
};

export const useModal = () => {
	const context = useContext(ModalContext);
	if (!context) {
		throw new Error('useModal must be used within a ModalProvider');
	}
	return context;
};

interface ModalBackdropProps {
	children: ReactNode;
	onClose: () => void;
}

const ModalBackdrop = ({ children, onClose }: ModalBackdropProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
	}, [onClose]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
			onClose();
		}
	};

	return (
		<div className={"backdrop"} onClick={handleBackdropClick}>
			<div className={"modalContent"} ref={modalRef}>
				<button className={"closeButton"} onClick={onClose} aria-label="Close modal">
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};