/**
 * Round a decimal number to x places.
 *
 * @param value - The number to be rounded.
 * @param [precision] (Optional) The amount of decimals to round to (default: 2).
 * @returns The rounded value.
 */
const toRounded = (value: number, precision: number = 2): number =>
  parseFloat(
    (Math.floor(value * Math.pow(10, precision)) / Math.pow(10, precision)).toPrecision(15),
  )

export default toRounded
