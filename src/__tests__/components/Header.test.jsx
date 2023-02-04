import React from "react";
import renderer from "react-test-renderer";
import Header from "../../components/Header";

describe("Header Component", () => {
  test("Header renders", () => {
    const container = renderer.create(<Header />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
