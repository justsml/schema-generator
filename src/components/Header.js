import React from 'react'

export default function Header () {
  return (
    <div className='jumbotron jumbotron-fluid'>
      {/* <div className="container d-flex justify-content-between align-items-center">
        <div className="head-text" style={{ flexGrow: 2 }}>
          <h1 className="display-4">Dan's Schema Generator</h1>
        </div>
      </div> */}
      <div className='container'>
        <p className='lead'>
          Paste JSON or CSV data to automatically generate a typed schema.
          <br />
          Supports <b>Mongoose, Knex, and SQL.</b>
        </p>
        <p className='lead'>
          <b>Note:</b> 100% local farm-to-table. (Your data is never sent to a
          server.)
        </p>
      </div>
    </div>
  )
}
