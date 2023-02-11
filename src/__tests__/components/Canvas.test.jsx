import React from "react";
import renderer from "react-test-renderer";
import Canvas from "../../components/Canvas";

describe("Canvas Component", () => {
  test("Canvas renders", () => {
    const container = renderer
      .create(<Canvas canvas={{ mapId: 1 }} />)
      .toJSON();

    expect(container).toMatchSnapshot();
  });
});
