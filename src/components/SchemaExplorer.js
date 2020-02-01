import React from 'react'
import Chart from 'react-apexcharts'

const schemaResults = {
  fields: {
    id: {
      unique: true,
      nullable: false,
      types: {
        Number: {
          count: 5,
          value: { min: 1, mean: 3, max: 5, percentiles: [2, 4, 5] }
        },
        String: {
          count: 5,
          length: { min: 1, mean: 1, max: 1, percentiles: [1, 1, 1] }
        }
      }
    },
    name: {
      unique: false,
      nullable: false,
      types: {
        String: {
          count: 5,
          length: { min: 3, mean: 7.2, max: 15, percentiles: [3, 10, 15] }
        }
      }
    },
    role: {
      enum: ['admin', 'user', 'poweruser'],
      unique: false,
      nullable: true,
      types: {
        String: {
          count: 5,
          length: { min: 4, mean: 5.4, max: 9, percentiles: [4, 5, 9] }
        }
      }
    },
    email: {
      unique: true,
      nullable: true,
      types: {
        Email: {
          count: 5,
          length: { min: 15, mean: 19.4, max: 26, percentiles: [15, 23, 26] }
        }
      }
    },
    createdAt: {
      unique: false,
      nullable: false,
      types: {
        Date: {
          count: 5,
          length: { min: 6, mean: 9.2, max: 10, percentiles: [10, 10, 10] }
        }
      }
    },
    accountConfirmed: {
      unique: false,
      nullable: false,
      types: {
        Boolean: { count: 5 }
      }
    }
  },
  totalRows: 5
}

const getFieldNames = (schemaResults) => {
  return Object.keys(schemaResults.fields)
}
const getFieldLabeledData = (schemaResults) => {
  return Object.entries(schemaResults.fields)
    .map(([fieldName, typeInfo]) => {
      const { types, enum: enumData, unique, nullable } = typeInfo
      if (enumData) fieldName = `${fieldName}(${enumData.length})`
      if (unique) fieldName = `${fieldName}*`
      if (nullable) fieldName = `[${fieldName}]`
      return {
        name: fieldName,
        data: [44, 55, 41, 37, 22, 43, 21]
      }
    })
}

export default class ApexChart extends React.Component {
  constructor (props) {
    super(props)

    this.state = {

      series: [{
        name: 'Marine Sprite',
        data: [44, 55, 41, 37, 22, 43, 21]
      }, {
        name: 'Striking Calf',
        data: [53, 32, 33, 52, 13, 43, 32]
      }, {
        name: 'Tank Picture',
        data: [12, 17, 11, 9, 15, 11, 20]
      }, {
        name: 'Bucket Slope',
        data: [9, 7, 5, 8, 6, 9, 4]
      }, {
        name: 'Reborn Kid',
        data: [25, 12, 19, 32, 25, 24, 10]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 600,
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        title: {
          text: 'Fiction Books Sales'
        },
        xaxis: {
          categories: getFieldNames(schemaResults), // [2008, 2009, 2010, 2011, 2012, 2013, 2014],
          labels: {
            formatter: function (val) {
              return val + 'K'
            }
          }
        },
        yaxis: {
          title: {
            text: undefined
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + 'K'
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        }
      }

    }
  }

  render () {
    return (
      <Chart options={this.state.options} series={this.state.series} type='bar' height={350} />)
  }
}
