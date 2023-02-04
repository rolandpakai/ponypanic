import React from "react";
import renderer from "react-test-renderer";
import MapScreen from "../../components/MapScreen";

describe("MapScreen Component", () => {
  test("MapScreen renders", () => {
    const container = renderer.create(<MapScreen />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
