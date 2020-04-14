import debug from 'debug'
const log = debug('adapters:common')

export const getFieldLengthArg = (fieldName, maxLength) => {
  if (maxLength > 4000) return 8000
  if (maxLength > 2000) return 4000
  if (maxLength > 1000) return 2000
  if (maxLength > 800) return 1000
  if (maxLength > 600) return 800
  if (maxLength > 400) return 600
  if (maxLength > 200) return 400
  if (maxLength > 100) return 200
  if (maxLength > 80) return 100
  if (maxLength > 60) return 80
  if (maxLength > 40) return 60
  if (maxLength > 20) return 40
  return 20
}

/**

Determine a "best guess" maximum field size, use the 90th percentile when
the distance between it and the maximum exceeds 30 percent (of the max value)

@example

Situation: A `City` field normally has a size range of 3-15 characters.
A glitch at our vendor swapped `City` with a huge text field in 1 record!

We don't want to set the limit way bigger than
necessary, as it'd be confusing and impact performance.

Reduced example - `very sparse` data: [3, 4, 5, 7, 9, 231429]
*/
export const correctForErroneousMaximum = (threshold = 0.1, ninetiethPct, maximum) => {
  const gapLimit = threshold * maximum
  const topTenPercentileRange = maximum - ninetiethPct
  if (topTenPercentileRange > gapLimit) {
    log('Correcting for erroneous maximum field value:', {
      ninetiethPct,
      maximum
    })
    return ninetiethPct
  }
  return maximum
}
