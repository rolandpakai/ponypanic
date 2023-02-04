import React from "react";
import renderer from "react-test-renderer";
import App from "../App";

describe("App Component", () => {
  test("App renders", () => {
    const container = renderer.create(<App />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
