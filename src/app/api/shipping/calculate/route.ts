import { NextResponse } from "next/server";

// Shipping rates configuration
const SHIPPING_RATES = {
  US: {
    standard: {
      id: "standard-us",
      name: "Standard Shipping",
      description: "6-8 business days",
      price: 0.0,
      tax_rate: 0.0,
    },
    express: {
      id: "express-us",
      name: "Express Shipping",
      description: "4-5 business days",
      price: 15.0,
      tax_rate: 0.08, // 8% tax on shipping
    },
  },
  CA: {
    standard: {
      id: "standard-ca",
      name: "Standard Shipping",
      description: "7-10 business days",
      price: 12.0,
      tax_rate: 0.05, // 5% GST
    },
    express: {
      id: "express-ca",
      name: "Express Shipping",
      description: "3-5 business days",
      price: 25.0,
      tax_rate: 0.05,
    },
  },
  AU: {
    standard: {
      id: "standard-au",
      name: "Standard Shipping",
      description: "3-5 business days",
      price: 0.0,
      tax_rate: 0.1, // 10% GST
    },
    express: {
      id: "express-au",
      name: "Express Shipping",
      description: "1-2 business days",
      price: 20.0,
      tax_rate: 0.1,
    },
  },
  GB: {
    standard: {
      id: "standard-gb",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: 8.0,
      tax_rate: 0.2, // 20% VAT
    },
    express: {
      id: "express-gb",
      name: "Express Shipping",
      description: "2-3 business days",
      price: 18.0,
      tax_rate: 0.2,
    },
  },
};

// Countries we support shipping to
const SUPPORTED_COUNTRIES = Object.keys(SHIPPING_RATES);

// Restricted shipping areas (states/regions where we don't ship)
const RESTRICTED_AREAS = {
  US: [], // No restrictions for US
  CA: [], // No restrictions for Canada
  AU: ["NT"], // Example: No shipping to Northern Territory
  GB: [], // No restrictions for UK
};

export async function POST(req: Request) {
  try {
    const {
      address,
      items = [],
      currency = "USD",
      orderTotal = 0,
    } = await req.json();

    if (!address || !address.countryCode) {
      return NextResponse.json(
        { error: "Address with country code is required" },
        { status: 400 }
      );
    }

    const countryCode = address.countryCode.toUpperCase();

    // Check if we support shipping to this country
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      return NextResponse.json(
        {
          error: "SHIPPING_UNSUPPORTED",
          message: "We don't ship to this country",
        },
        { status: 400 }
      );
    }

    // Check for restricted areas within supported countries
    const restrictedAreas =
      RESTRICTED_AREAS[countryCode as keyof typeof RESTRICTED_AREAS] || [];
    if (restrictedAreas.length > 0 && address.state) {
      const stateCode = address.state.toUpperCase();
      if (restrictedAreas.includes(stateCode)) {
        return NextResponse.json(
          {
            error: "SHIPPING_ADDRESS_UNSUPPORTED",
            message: "We don't ship to this area",
          },
          { status: 400 }
        );
      }
    }

    // Get shipping rates for the country
    const countryRates =
      SHIPPING_RATES[countryCode as keyof typeof SHIPPING_RATES];
    if (!countryRates) {
      return NextResponse.json(
        {
          error: "SHIPPING_UNSUPPORTED",
          message: "No shipping rates available for this country",
        },
        { status: 400 }
      );
    }

    // Calculate shipping options
    const shippingOptions = Object.values(countryRates).map((rate) => {
      const shippingAmount = rate.price;
      const taxAmount = shippingAmount * rate.tax_rate;
      const totalWithShipping = orderTotal + shippingAmount + taxAmount;

      return {
        id: rate.id,
        name: rate.name,
        description: rate.description,
        shippingAmount: {
          amount: shippingAmount.toFixed(2),
          currency: currency,
        },
        taxAmount: {
          amount: taxAmount.toFixed(2),
          currency: currency,
        },
        orderAmount: {
          amount: totalWithShipping.toFixed(2),
          currency: currency,
        },
      };
    });
    return NextResponse.json({
      success: true,
      shippingOptions,
      supportedCountry: countryCode,
    });
  } catch (error: any) {
    console.error("Shipping calculation error:", error);
    return NextResponse.json(
      {
        error: "SERVICE_UNAVAILABLE",
        message: "Unable to calculate shipping rates",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
