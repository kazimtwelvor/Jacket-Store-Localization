"use client";

import { useEffect, useState } from 'react';
import CartSidebar from './cart-sidebar';

export default function CartSidebarWrapper() {
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const handleModalOpen = (isOpen: boolean) => {
            if (isOpen) {
                document.body.classList.add('modal-open');
            } else {
                document.body.classList.remove('modal-open');
            }
        };

        window.addEventListener('modalStateChange', (e: any) => {
            handleModalOpen(e.detail.isOpen);
        });

        window.addEventListener('openCart', () => {
            setIsCartOpen(true);
        });

        return () => {
            window.removeEventListener('modalStateChange', (e: any) => {
                handleModalOpen(e.detail.isOpen);
            });
            window.removeEventListener('openCart', () => {
                setIsCartOpen(true);
            });
        };
    }, []);

    return (
        <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
        />
    );
}
