"use client"

import { Truck, RotateCcw,} from "lucide-react"


interface DeliveryInfoProps {
  deliveryDates: {
    earliest: string
    latest: string
  }
  isMobile: boolean
}

const DeliveryInfo = ({ deliveryDates, isMobile }: DeliveryInfoProps) => {
  return (
    <div className="mb-6">
      <div className="relative bg-black/[0.04] p-4 ">
      
        
        <div className="space-y-2">
          {/* Free Shipping */}
          <div className="flex items-center gap-3 p-3 border border-gray ">
            <div className="bg-gray p-2">
              <Truck className="h-5 w-5 text-black"/>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#000]">Free Shipping Over $150 USD</p>
           
            </div>
          </div>

          {/* 30 Days Return */}
          <div className="flex items-center gap-3 p-3  border border-gray ">
            <div className="bg-gray p-2">
              <RotateCcw className="h-5 w-5 text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#000]">30 Days Free Return Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryInfo