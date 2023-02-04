import React from "react";
import renderer from "react-test-renderer";
import MapContainer from "../../components/MapContainer";

describe("MapContainer Component", () => {
  test("MapContainer renders", () => {
    const container = renderer.create(<MapContainer />).toJSON();

    expect(container).toMatchSnapshot();
  });
});
