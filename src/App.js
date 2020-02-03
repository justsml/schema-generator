import React, { useState } from 'react'
import './styles.css'
import Header from './components/Header'
import NavBar from './components/NavBar'
import GeneratorForm from './components/GeneratorForm'
import SchemaExplorer from './components/SchemaExplorer'
import AdvancedOptionsForm from './components/AdvancedOptionsForm'
import PopoverWrapper from './components/PopoverWrapper'

export default function App () {
  const [options, setOptions] = useState({})
  const [schema, setSchema] = useState(productResults)
  return (
    <div className='App container'>
      {/* <NavBar /> */}
      {/* <Header /> */}
      <PopoverWrapper buttonLabel='Advanced Options'>
        <AdvancedOptionsForm onSave={options => setOptions(options)} currentOptions={options} className='options-ui' />
      </PopoverWrapper>
      <GeneratorForm className='generator-form' onSave={options => setOptions(options)} onSchema={(schema, title) => setSchema(schema)} />
      <SchemaExplorer schemaResults={schema} />
    </div>
  )
}

const productResults = {
  fields: {
    'GTIN-14': {
      unique: true,
      nullable: false,
      types: {
        String: {
          rank: 12,
          count: 3135,
          length: {
            min: 14,
            mean: 14,
            max: 14,
            percentiles: [
              14,
              14,
              14
            ]
          }
        },
        Number: {
          rank: 8,
          count: 4,
          value: {
            min: 30614141000990,
            mean: 61830347210480.75,
            max: 88089922063858,
            percentiles: [
              50001125576642,
              78616200200433,
              88089922063858
            ]
          }
        }
      },
      uniqueCount: 3135
    },
    'Brand Name': {
      unique: false,
      nullable: true,
      types: {
        String: {
          rank: 12,
          count: 2982,
          length: {
            min: 1,
            mean: 19.317236753856474,
            max: 199,
            percentiles: [
              7,
              11,
              47
            ]
          }
        },
        Unknown: {
          rank: -1,
          count: 153
        },
        Number: {
          rank: 8,
          count: 3,
          value: {
            min: 5056071167017,
            mean: 6028831501996.667,
            max: 7429111285404,
            percentiles: [
              5056071167017,
              5601312053569,
              7429111285404
            ]
          }
        }
      },
      uniqueCount: 1914
    },
    Name: {
      unique: false,
      nullable: false,
      types: {
        String: {
          rank: 12,
          count: 3134,
          length: {
            min: 1,
            mean: 22.569878749202296,
            max: 227,
            percentiles: [
              14,
              23,
              36
            ]
          }
        },
        Boolean: {
          rank: 3,
          count: 1
        },
        Number: {
          rank: 8,
          count: 2,
          value: {
            min: 10,
            mean: 2528035583513.5,
            max: 5056071167017,
            percentiles: [
              10,
              5056071167017,
              5056071167017
            ]
          }
        }
      },
      uniqueCount: 2307
    },
    Size: {
      unique: false,
      nullable: true,
      types: {
        String: {
          rank: 12,
          count: 2274,
          length: {
            min: 1,
            mean: 6.003518029903254,
            max: 92,
            percentiles: [
              4,
              5,
              10
            ]
          }
        },
        Unknown: {
          rank: -1,
          count: 851
        },
        Float: {
          rank: 7,
          count: 10,
          value: {
            min: 0.12,
            mean: 9.326,
            max: 28.3,
            percentiles: [
              0.75,
              16.9,
              28.3
            ]
          },
          scale: {
            min: 1,
            mean: 1.3,
            max: 2,
            percentiles: [
              1,
              1,
              2
            ]
          },
          precision: {
            min: 2,
            mean: 2.7,
            max: 3,
            percentiles: [
              3,
              3,
              3
            ]
          }
        },
        Number: {
          rank: 8,
          count: 74,
          value: {
            min: 0.2,
            mean: 74353991381.50294,
            max: 5056071167017,
            percentiles: [
              12,
              48,
              300
            ]
          }
        }
      },
      uniqueCount: 956
    },
    Ingredients: {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 2947
        },
        String: {
          rank: 12,
          count: 188,
          length: {
            min: 4,
            mean: 119.43085106382979,
            max: 899,
            percentiles: [
              31,
              77,
              312
            ]
          }
        },
        Number: {
          rank: 8,
          count: 1,
          value: {
            min: 665274,
            mean: 665274,
            max: 665274,
            percentiles: [
              665274,
              665274,
              665274
            ]
          }
        }
      },
      uniqueCount: 170
    },
    'Serving Size': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3031
        },
        String: {
          rank: 12,
          count: 104,
          length: {
            min: 1,
            mean: 8.413461538461538,
            max: 62,
            percentiles: [
              4,
              7,
              17
            ]
          }
        },
        Number: {
          rank: 8,
          count: 13,
          value: {
            min: 1,
            mean: 53.61538461538461,
            max: 250,
            percentiles: [
              1,
              55,
              100
            ]
          }
        }
      },
      uniqueCount: 80
    },
    'Servings Per Container': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3034
        },
        Number: {
          rank: 8,
          count: 66,
          value: {
            min: 1,
            mean: 13.151515151515152,
            max: 100,
            percentiles: [
              1,
              6,
              40
            ]
          }
        },
        String: {
          rank: 12,
          count: 96,
          length: {
            min: 1,
            mean: 3.2395833333333335,
            max: 18,
            percentiles: [
              1,
              2,
              8
            ]
          }
        },
        Float: {
          rank: 7,
          count: 5,
          value: {
            min: 0.5,
            mean: 3.504,
            max: 7.5,
            percentiles: [
              2.5,
              3.52,
              7.5
            ]
          },
          scale: {
            min: 1,
            mean: 1.2,
            max: 2,
            percentiles: [
              1,
              1,
              2
            ]
          },
          precision: {
            min: 2,
            mean: 2.2,
            max: 3,
            percentiles: [
              2,
              2,
              3
            ]
          }
        }
      },
      uniqueCount: 46
    },
    Calories: {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3001
        },
        Number: {
          rank: 8,
          count: 116,
          value: {
            min: 1,
            mean: 3588.7413793103447,
            max: 372000,
            percentiles: [
              114,
              210,
              513
            ]
          }
        },
        String: {
          rank: 12,
          count: 130,
          length: {
            min: 1,
            mean: 2.5153846153846153,
            max: 6,
            percentiles: [
              2,
              3,
              3
            ]
          }
        },
        Date: {
          rank: 4,
          count: 4
        }
      },
      uniqueCount: 84
    },
    'Fat Calories': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3072
        },
        Number: {
          rank: 8,
          count: 38,
          value: {
            min: 1,
            mean: 87.89473684210526,
            max: 824,
            percentiles: [
              33,
              70,
              120
            ]
          }
        },
        String: {
          rank: 12,
          count: 63,
          length: {
            min: 1,
            mean: 1.6349206349206349,
            max: 3,
            percentiles: [
              1,
              2,
              3
            ]
          }
        }
      },
      uniqueCount: 23
    },
    'Fat (g)': {
      types: {
        Unknown: {
          rank: -1,
          count: 3006
        },
        Float: {
          rank: 7,
          count: 129,
          value: {
            min: 0.5,
            mean: 11.25125,
            max: 100,
            percentiles: [
              3.5,
              10,
              26
            ]
          },
          scale: {
            min: 1,
            mean: 1,
            max: 1,
            percentiles: [
              1,
              1,
              1
            ]
          },
          precision: {
            min: 2,
            mean: 2.3157894736842106,
            max: 3,
            percentiles: [
              2,
              2,
              3
            ]
          }
        }
      }
    },
    'Saturated Fat (g)': {
      types: {
        Unknown: {
          rank: -1,
          count: 3034
        },
        Float: {
          rank: 7,
          count: 101,
          value: {
            min: 0.2,
            mean: 4.3277777777777775,
            max: 17,
            percentiles: [
              1.5,
              3.5,
              10.5
            ]
          },
          scale: {
            min: 1,
            mean: 1,
            max: 1,
            percentiles: [
              1,
              1,
              1
            ]
          },
          precision: {
            min: 2,
            mean: 2.0384615384615383,
            max: 3,
            percentiles: [
              2,
              2,
              2
            ]
          }
        }
      }
    },
    'Trans Fat (g)': {
      types: {
        Unknown: {
          rank: -1,
          count: 3077
        },
        Float: {
          rank: 7,
          count: 58,
          value: {
            min: 1,
            mean: 4,
            max: 7,
            percentiles: [
              1,
              7,
              7
            ]
          }
        }
      }
    },
    'Polyunsaturated Fat (g)': {
      types: {
        Unknown: {
          rank: -1,
          count: 3104
        },
        Float: {
          rank: 7,
          count: 31,
          value: {
            min: 0.5,
            mean: 5.066666666666666,
            max: 39,
            percentiles: [
              2,
              2.5,
              8
            ]
          },
          scale: {
            min: 1,
            mean: 1,
            max: 1,
            percentiles: [
              1,
              1,
              1
            ]
          },
          precision: {
            min: 2,
            mean: 2,
            max: 2,
            percentiles: [
              2,
              2,
              2
            ]
          }
        }
      }
    },
    'Monounsaturated Fat (g)': {
      types: {
        Unknown: {
          rank: -1,
          count: 3104
        },
        Float: {
          rank: 7,
          count: 31,
          value: {
            min: 0.5,
            mean: 8.733333333333333,
            max: 42,
            percentiles: [
              3,
              9.5,
              11.5
            ]
          },
          scale: {
            min: 1,
            mean: 1,
            max: 1,
            percentiles: [
              1,
              1,
              1
            ]
          },
          precision: {
            min: 2,
            mean: 2.25,
            max: 3,
            percentiles: [
              2,
              2,
              3
            ]
          }
        }
      }
    },
    'Cholesterol (mg)': {
      unique: false,
      nullable: true,
      enum: [
        '0',
        '30',
        '10',
        '25',
        '75',
        '4',
        '1',
        '35'
      ],
      types: {
        Unknown: {
          rank: -1,
          count: 3079
        },
        String: {
          rank: 12,
          count: 56,
          length: {
            min: 1,
            mean: 1.1071428571428572,
            max: 2,
            percentiles: [
              1,
              1,
              2
            ]
          }
        },
        Number: {
          rank: 8,
          count: 8,
          value: {
            min: 1,
            mean: 26.25,
            max: 75,
            percentiles: [
              10,
              30,
              75
            ]
          }
        }
      },
      uniqueCount: 8
    },
    'Sodium (mg)': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3042
        },
        Number: {
          rank: 8,
          count: 65,
          value: {
            min: 1,
            mean: 137.93846153846152,
            max: 660,
            percentiles: [
              23,
              135,
              390
            ]
          }
        },
        String: {
          rank: 12,
          count: 93,
          length: {
            min: 1,
            mean: 1.935483870967742,
            max: 3,
            percentiles: [
              1,
              2,
              3
            ]
          }
        }
      },
      uniqueCount: 46
    },
    'Potassium (mg)': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3095
        },
        Number: {
          rank: 8,
          count: 16,
          value: {
            min: 3,
            mean: 691,
            max: 8500,
            percentiles: [
              70,
              120,
              850
            ]
          }
        },
        String: {
          rank: 12,
          count: 39,
          length: {
            min: 1,
            mean: 1.5128205128205128,
            max: 3,
            percentiles: [
              1,
              1,
              3
            ]
          }
        },
        Date: {
          rank: 4,
          count: 1
        }
      },
      uniqueCount: 15
    },
    'Carbohydrate (g)': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3014
        },
        Number: {
          rank: 8,
          count: 101,
          value: {
            min: 1,
            mean: 34.37623762376238,
            max: 100,
            percentiles: [
              15,
              36,
              70
            ]
          }
        },
        String: {
          rank: 12,
          count: 121,
          length: {
            min: 1,
            mean: 1.7024793388429753,
            max: 3,
            percentiles: [
              1,
              2,
              2
            ]
          }
        }
      },
      uniqueCount: 55
    },
    'Fiber (g)': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3053
        },
        Number: {
          rank: 8,
          count: 43,
          value: {
            min: 1,
            mean: 3.441860465116279,
            max: 19,
            percentiles: [
              1,
              2,
              7
            ]
          }
        },
        String: {
          rank: 12,
          count: 82,
          length: {
            min: 1,
            mean: 1.0365853658536586,
            max: 2,
            percentiles: [
              1,
              1,
              1
            ]
          }
        }
      },
      uniqueCount: 11
    },
    'Sugars (g)': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3022
        },
        Number: {
          rank: 8,
          count: 78,
          value: {
            min: 1,
            mean: 21.846153846153847,
            max: 100,
            percentiles: [
              4,
              16,
              58
            ]
          }
        },
        String: {
          rank: 12,
          count: 113,
          length: {
            min: 1,
            mean: 1.424778761061947,
            max: 3,
            percentiles: [
              1,
              2,
              2
            ]
          }
        }
      },
      uniqueCount: 36
    },
    'Protein (g)': {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3017
        },
        Number: {
          rank: 8,
          count: 77,
          value: {
            min: 1,
            mean: 6.220779220779221,
            max: 45,
            percentiles: [
              2,
              6,
              13
            ]
          }
        },
        String: {
          rank: 12,
          count: 118,
          length: {
            min: 1,
            mean: 1.0932203389830508,
            max: 2,
            percentiles: [
              1,
              1,
              1
            ]
          }
        }
      },
      uniqueCount: 18
    },
    Author: {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3087
        },
        String: {
          rank: 12,
          count: 48,
          length: {
            min: 6,
            mean: 17.416666666666668,
            max: 56,
            percentiles: [
              12,
              15,
              31
            ]
          }
        }
      },
      uniqueCount: 45
    },
    Format: {
      unique: false,
      nullable: true,
      enum: [
        'Hardcover',
        'Paperback'
      ],
      types: {
        Unknown: {
          rank: -1,
          count: 3085
        },
        String: {
          rank: 12,
          count: 50,
          length: {
            min: 9,
            mean: 9,
            max: 9,
            percentiles: [
              9,
              9,
              9
            ]
          }
        }
      },
      uniqueCount: 2
    },
    Publisher: {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3083
        },
        String: {
          rank: 12,
          count: 52,
          length: {
            min: 3,
            mean: 16.192307692307693,
            max: 58,
            percentiles: [
              8,
              17,
              27
            ]
          }
        }
      },
      uniqueCount: 44
    },
    Pages: {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3085
        },
        Number: {
          rank: 8,
          count: 50,
          value: {
            min: 20,
            mean: 364.36,
            max: 1943,
            percentiles: [
              208,
              351,
              704
            ]
          }
        },
        String: {
          rank: 12,
          count: 47,
          length: {
            min: 2,
            mean: 2.9148936170212765,
            max: 3,
            percentiles: [
              3,
              3,
              3
            ]
          }
        },
        Date: {
          rank: 4,
          count: 3
        }
      },
      uniqueCount: 49
    },
    'Alcohol By Volume': {
      types: {
        Unknown: {
          rank: -1,
          count: 3134
        },
        Float: {
          rank: 7,
          count: 1,
          value: {
            min: 40,
            mean: 40,
            max: 40,
            percentiles: [
              40,
              40,
              40
            ]
          }
        }
      }
    },
    Images: {
      unique: false,
      nullable: true,
      types: {
        Unknown: {
          rank: -1,
          count: 3116
        },
        String: {
          rank: 12,
          count: 19,
          length: {
            min: 78,
            mean: 136.94736842105263,
            max: 398,
            percentiles: [
              78,
              78,
              318
            ]
          }
        }
      },
      uniqueCount: 19
    }
  },
  totalRows: 3135
}

// const schemaResults = {
//   fields: {
//     id: {
//       unique: true,
//       nullable: false,
//       types: {
//         Number: {
//           count: 5,
//           value: { min: 1, mean: 3, max: 5, percentiles: [2, 4, 5] }
//         },
//         String: {
//           count: 5,
//           length: { min: 1, mean: 1, max: 1, percentiles: [1, 1, 1] }
//         }
//       }
//     },
//     name: {
//       unique: false,
//       nullable: false,
//       types: {
//         String: {
//           count: 5,
//           length: { min: 3, mean: 7.2, max: 15, percentiles: [3, 10, 15] }
//         }
//       }
//     },
//     role: {
//       enum: ['admin', 'user', 'poweruser'],
//       unique: false,
//       nullable: true,
//       types: {
//         String: {
//           count: 5,
//           length: { min: 4, mean: 5.4, max: 9, percentiles: [4, 5, 9] }
//         }
//       }
//     },
//     email: {
//       unique: true,
//       nullable: true,
//       types: {
//         Email: {
//           count: 5,
//           length: { min: 15, mean: 19.4, max: 26, percentiles: [15, 23, 26] }
//         }
//       }
//     },
//     createdAt: {
//       unique: false,
//       nullable: false,
//       types: {
//         Date: {
//           count: 5,
//           length: { min: 6, mean: 9.2, max: 10, percentiles: [10, 10, 10] }
//         }
//       }
//     },
//     accountConfirmed: {
//       unique: false,
//       nullable: false,
//       types: {
//         Boolean: { count: 5 }
//       }
//     }
//   },
//   totalRows: 5
// }

// const typesList = [
//   'Unknown',
//   'ObjectId',
//   'UUID',
//   'Boolean',
//   'Date',
//   'Timestamp',
//   'Currency',
//   'Float',
//   'Number',
//   'Email',
//   'String',
//   'Array',
//   'Object',
//   'Null'
// ]
