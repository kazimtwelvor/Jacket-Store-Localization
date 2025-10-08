interface OrderEmailData {
  customerEmail: string
  customerName: string
  orderNumber: string
  orderTotal: string
  items: Array<{
    name: string
    quantity: number
    price: string
  }>
  shippingAddress?: any
  billingAddress?: any
}

export const sendOrderEmails = async (orderData: OrderEmailData) => {
  try {
    const response = await fetch('/api/orders/send-order-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    const result = await response.json()
    
    if (result.success) {
      return { success: true, ...result }
    } else {
      console.error('❌ Failed to send order emails:', result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('❌ Error sending order emails:', error)
    return { success: false, error: 'Network error' }
  }
}