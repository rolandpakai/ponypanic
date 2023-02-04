import React from "react";
import renderer from "react-test-renderer";
import TitleContainer from "../../components/TitleContainer";

describe("TitleContainer Component", () => {
  test("TitleContainer renders", () => {
    const container = renderer.create(<TitleContainer />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
