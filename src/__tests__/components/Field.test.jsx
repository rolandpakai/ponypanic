import React from "react";
import { render } from "@testing-library/react";
import Field from "../../components/Field";

describe("Field Component", () => {
  test("Field renders", () => {
    const { container } = render(<Field />);

    expect(container).toMatchSnapshot();
  });
});
