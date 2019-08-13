import React from "react";
import { Grid } from "react-bootstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <Grid fluid>
          <nav className="pull-left">
            <ul>
              <li>
                <a href="https://github.com/mxmstr/servo-backend">Source</a>
              </li>
            </ul>
          </nav>
          <p className="copyright pull-right">
            &copy; {new Date().getFullYear()}{" "} Eric Lynch
          </p>
        </Grid>
      </footer>
    );
  }
}

export default Footer;