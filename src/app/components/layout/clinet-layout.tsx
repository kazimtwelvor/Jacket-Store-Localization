"use client";

import { useEffect, useState } from 'react';
import { CartProvider } from '@/src/app/contexts/CartContext';
import CartSidebar from '@/src/app/components/layout/cart-sidebar';
import SuggestedProducts from '@/src/app/components/layout/suggested-product-layou';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [showSuggested, setShowSuggested] = useState(false)

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

        window.addEventListener('showSuggested', () => {
            setShowSuggested(true);
        });

        return () => {
            window.removeEventListener('modalStateChange', (e: any) => {
                handleModalOpen(e.detail.isOpen);
            });
            window.removeEventListener('openCart', () => {
                setIsCartOpen(true);
            });
            window.removeEventListener('showSuggested', () => {
                setShowSuggested(true);
            });
        };
    }, []);

    return (
        <CartProvider>
            {children}
            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <SuggestedProducts
                isOpen={showSuggested}
                onClose={() => setShowSuggested(false)}
                products={[]}
            />
        </CartProvider>
    );
}