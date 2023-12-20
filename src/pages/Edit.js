import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const App = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, This service haven't done."
    extra={
      <Button type="primary">
        <Link to="/tables">Back Home</Link>
      </Button>
    }
  />
);
export default App;
