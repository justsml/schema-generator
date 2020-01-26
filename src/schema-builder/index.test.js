import { schemaBuilder, condenseFieldData } from './index.js';

const uniques = {
  title: ['lorem ipsum dolor sit amet', 'amit ipsum dolor sit amet', 'amit ipsum dolor sit Lorem ipsum', 'amit Lorem ipsum amit dolor amet'],
  status: ['active' ,'inactive'],
  features: [],
  listPrice: [],
  salePrice: [],
  estimatedPrice: []
}
const fieldInfoByKey = {
  title: [{
      String: { rank: 1, length: 20 }
    }, {
      String: { rank: 1, length: 50 }
    }, {
      String: { rank: 1, length: 40 }
    }, {
      String: { rank: 1, length: 66 },
      Null: { rank: 2 }
    }, {
      Null: {}
    }
  ],
  status: [
    { String: { rank: 1, length: 6 } },
    { String: { rank: 1, length: 6 } },
    { String: { rank: 1, length: 6 } },
    { String: { rank: 1, length: 6 } },
    { String: { rank: 1, length: 8 } },
    { String: { rank: 1, length: 8 } }
  ],
  features: [
    {Array: { length: 2 }},
    {Array: { length: 1 }},
    {Array: { length: 0 }},
    {Array: { length: 10 }},
    {Array: { length: 18 }}
  ],
  listPrice: [{
      Float: { scale: 7, precision: 2 },
      String: { length: 8 }
    }, {
      Float: { scale: 9, precision: 2 },
      String: { length: 10 }
    }, {
      Float: { scale: 2, precision: 2 }
    }, {
      Float: { scale: 4, precision: 2 },
      String: { length: 5 }
    }, {
      Float: { scale: 4, precision: 2 },
      String: { length: 5 }
    }
  ],
  salePrice: [{
      Float: { scale: 7, precision: 2 }
    }, {
      Float: { scale: 6, precision: 2 }
    }, {
      Number: { length: 4 },
      String: { length: 4 }
    }, {
      Float: { scale: 4, precision: 2 },
      String: { length: 5 }
    }, {
      Float: { scale: 5, precision: 2 },
      String: { length: 6 }
    }
  ],
  estimatedPrice: [{
      Float: { scale: 5, precision: 2 },
      String: { length: 6 }
    }, {
      Number: { length: 6 },
      String: { length: 3 }
    }, {
      Float: { scale: 5, precision: 2 }
    }, {
      Float: { scale: 5, precision: 2 }
    }, {
      Float: { scale: 5, precision: 2 },
      String: { length: 2 }
    }
  ]
}

it('should compute range stats from array of objects', () => {
  expect(condenseFieldData(fieldInfoByKey)).toMatchSnapshot('fieldInfoByKey')
})
