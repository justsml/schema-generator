import {
  priority,
  TYPE_UNKNOWN,
  TYPE_OBJECT_ID,
  TYPE_UUID,
  TYPE_BOOLEAN,
  TYPE_DATE,
  TYPE_TIMESTAMP,
  TYPE_CURRENCY,
  TYPE_FLOAT,
  TYPE_NUMBER,
  TYPE_NULL,
  TYPE_STRING,
  TYPE_ARRAY,
  TYPE_OBJECT
} from '../type-helpers.js'

it('can detect ambiguous data', () => {
  expect(TYPE_UNKNOWN.check('')).toBe(true)
  expect(TYPE_UNKNOWN.check('undefined')).toBe(true)
  expect(TYPE_UNKNOWN.check(undefined)).toBe(true)
  expect(TYPE_UNKNOWN.check(null)).toBe(false)
})

it('can detect objectId\'s', () => {
  expect(TYPE_OBJECT_ID.check("112345679065574883030833")).toBe(true)
  expect(TYPE_OBJECT_ID.check("FFFFFFFFFFFFFFFFFFFFFFFF")).toBe(true)
  expect(TYPE_OBJECT_ID.check("45cbc4a0e4123f6920000002")).toBe(true)
  expect(TYPE_OBJECT_ID.check("45cbc4a0e4123f6920")).toBe(false)
})

it('can detect UUID strings', () => {
  expect(TYPE_UUID.check('AB0E1569-B8A1-430F-94BE-B03E5C73FA22')).toBe(true)
  expect(TYPE_UUID.check('60CFE5A5-D301-45B1-BC0D-0D9720AD19CD')).toBe(true)
  expect(TYPE_UUID.check('60CFE5A5-D301-45B1-0D9720AD19CD')).toBe(false)
  expect(TYPE_UUID.check('60CFE5A5D30145B1BC0D0D9720AD19CD')).toBe(false)
})
