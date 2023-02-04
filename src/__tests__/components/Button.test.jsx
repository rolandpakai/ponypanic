import React from "react";
import renderer from "react-test-renderer";
import Button from "../../components/Button";

describe("Button Component", () => {
  test("Button renders", () => {
    const container = renderer.create(<Button />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
