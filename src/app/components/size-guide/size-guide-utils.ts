export const inchesToCm = (inches: number): number => {
  return inches * 2.54
}

export const cmToInches = (cm: number): number => {
  return cm / 2.54
}

export const formatMeasurement = (value: number, unit: "in" | "cm"): string => {
  return unit === "in" ? `${value}"` : `${value} cm`
}

export const getSizeRecommendation = (
  gender: "male" | "female",
  bodyType: "slim" | "average" | "athletic" | "plus",
  height: "petite" | "average" | "tall",
  measurements: {
    chest?: number
    waist?: number
    hips?: number
  },
): string => {
  if (gender === "female") {
    if (bodyType === "slim") {
      return height === "petite" ? "XS" : "S"
    } else if (bodyType === "average") {
      return height === "petite" ? "S" : "M"
    } else if (bodyType === "athletic") {
      return "M"
    } else {
      return height === "tall" ? "XL" : "L"
    }
  } else {
    if (bodyType === "slim") {
      return height === "petite" ? "S" : "M"
    } else if (bodyType === "average") {
      return height === "tall" ? "L" : "M"
    } else if (bodyType === "athletic") {
      return height === "tall" ? "XL" : "L"
    } else {
      return height === "tall" ? "XXL" : "XL"
    }
  }
}
