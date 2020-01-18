import React from "react";

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a
        className="navbar-brand"
        href="https://github.com/justsml/schema-generator"
      >
        Schema Generator
      </a>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="https://danlevy.net" target="_blank">
            Author
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="https://github.com/justsml/schema-generator"
          >
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  );
}
