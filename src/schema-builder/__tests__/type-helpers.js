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
  expect(TYPE_OBJECT_ID.check('112345679065574883030833')).toBe(true)
  expect(TYPE_OBJECT_ID.check('FFFFFFFFFFFFFFFFFFFFFFFF')).toBe(true)
  expect(TYPE_OBJECT_ID.check('45cbc4a0e4123f6920000002')).toBe(true)
  expect(TYPE_OBJECT_ID.check('45cbc4a0e4123f6920')).toBe(false)
})

it('can detect UUID strings', () => {
  expect(TYPE_UUID.check('AB0E1569-B8A1-430F-94BE-B03E5C73FA22')).toBe(true)
  expect(TYPE_UUID.check('60CFE5A5-D301-45B1-BC0D-0D9720AD19CD')).toBe(true)
  expect(TYPE_UUID.check('60CFE5A5-D301-45B1-0D9720AD19CD')).toBe(false)
  expect(TYPE_UUID.check('60CFE5A5D30145B1BC0D0D9720AD19CD')).toBe(false)
})


it('can detect boolean', () => {
  expect(TYPE_BOOLEAN.check('true')).toBe(true)
  expect(TYPE_BOOLEAN.check('true')).toBe(true)
  expect(TYPE_BOOLEAN.check('true')).toBe(true)
  expect(TYPE_BOOLEAN.check('true')).toBe(true)
})
it('can detect date', () => {
  expect(TYPE_DATE.check('2083-06-12T02:49:23.473Z')).toBe(true)
  expect(TYPE_DATE.check('2020-06-12T02:49:23.473Z')).toBe(true)
  expect(TYPE_DATE.check('2000-01-01')).toBe(true)
  expect(TYPE_DATE.check('2000-01-99')).toBe(false)
})
it('can detect timestamp', () => {
  expect(TYPE_TIMESTAMP.check(1579994163473)).toBe(true)
  expect(TYPE_TIMESTAMP.check(2579994163473)).toBe(true)
  expect(TYPE_TIMESTAMP.check('1579994163473')).toBe(true)
  expect(TYPE_TIMESTAMP.check('9999999993473')).toBe(false)
  expect(TYPE_TIMESTAMP.check('999999999473')).toBe(false)
  expect(TYPE_TIMESTAMP.check('99999999993473')).toBe(false)
})

it('can detect currency', () => {
  expect(TYPE_CURRENCY.check('$1')).toBeTruthy()
  expect(TYPE_CURRENCY.check('€500')).toBeTruthy()
  expect(TYPE_CURRENCY.check('¥9999')).toBeTruthy()
  expect(TYPE_CURRENCY.check('$1.00')).toBeTruthy()
  expect(TYPE_CURRENCY.check('$1,00')).toBeTruthy()
  expect(TYPE_CURRENCY.check('$42,000,000')).toBeTruthy()
})
it('can detect float', () => {
  expect(TYPE_FLOAT.check('1.1')).toBeTruthy()
  expect(TYPE_FLOAT.check('1.1234567890')).toBeTruthy()
  expect(TYPE_FLOAT.check('-1.10000')).toBeTruthy()
  expect(TYPE_FLOAT.check(42.1)).toBeTruthy()
  expect(TYPE_FLOAT.check(42)).toBeFalsy()
  expect(TYPE_FLOAT.check(Infinity)).toBeFalsy()
})
it('can detect number', () => {
  expect(TYPE_NUMBER.check('42')).toBeTruthy()
  expect(TYPE_NUMBER.check('42')).toBeTruthy()
  expect(TYPE_NUMBER.check('1.1')).toBeTruthy()
  expect(TYPE_NUMBER.check('1.1234567890')).toBeTruthy()
  expect(TYPE_NUMBER.check('-1.10000')).toBeTruthy()

})
it('can detect null', () => {
  expect(TYPE_NULL.check(null)).toBeTruthy()
  expect(TYPE_NULL.check('NULL')).toBeTruthy()
  expect(TYPE_NULL.check('null')).toBeTruthy()
  expect(TYPE_NULL.check('nil')).toBeFalsy()
  expect(TYPE_NULL.check('NIL')).toBeFalsy()
  expect(TYPE_NULL.check('Nope')).toBeFalsy()
})
it('can detect string', () => {
  expect(TYPE_STRING.check('abc')).toBeTruthy()
  expect(TYPE_STRING.check('123')).toBeTruthy()
  expect(TYPE_STRING.check('TEST')).toBeTruthy()
  expect(TYPE_STRING.check('')).toBeFalsy() // too little entropy data
})
it('can detect array', () => {
  expect(TYPE_ARRAY.check([''])).toBeTruthy()
  expect(TYPE_ARRAY.check(['', 123])).toBeTruthy()
  expect(TYPE_ARRAY.check({})).toBeFalsy()
})
it('can detect object', () => {
  expect(TYPE_OBJECT.check({})).toBeTruthy()
  expect(TYPE_OBJECT.check({goat: []})).toBeTruthy()
  expect(TYPE_OBJECT.check([])).toBeFalsy()
  expect(TYPE_OBJECT.check(null)).toBeFalsy()
})
