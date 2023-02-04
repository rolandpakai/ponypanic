import React from "react";
import renderer from "react-test-renderer";
import TitleScreen from "../../components/TitleScreen";

describe("TitleScreen Component", () => {
  test("TitleScreen renders", () => {
    const container = renderer.create(<TitleScreen />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
