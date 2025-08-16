
import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import CartSidebar from "@/src/app/components/layout/cart-sidebar"
import { useCart } from "@/src/app/contexts/CartContext"
import Button from "../../ui/button"

const NavbarActions = () => {
    const { items } = useCart()
    const [isCartOpen, setIsCartOpen] = useState(false)

    return (
        <>
            <section className="ml-auto flex items-center space-x-4">
                <Button
                    onClick={() => setIsCartOpen(true)}
                    className="flex items-center rounded-full bg-black px-3 py-2 text-sm font-medium text-white shadow-md hover:bg-white hover:text-black"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
                    {items.length}
                </Button>
            </section>
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default NavbarActions
