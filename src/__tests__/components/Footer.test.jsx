import React from "react";
import renderer from "react-test-renderer";
import Footer from "../../components/Footer";

describe("Footer Component", () => {
  test("Footer renders", () => {
    const container = renderer.create(<Footer />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
