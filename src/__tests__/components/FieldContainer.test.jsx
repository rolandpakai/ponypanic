import React from "react";
import { render } from "@testing-library/react";
import FieldContainer from "../../components/FieldContainer";
import Field from "../../components/fields/Field";
import { FIELD_TYPE, IMG_BIG_SIZE } from "../../utils/constants";

describe("FieldContainer Component", () => {
  test("FieldContainer renders", () => {
    const { container } = render(
      <FieldContainer
        idd="idd"
        size={IMG_BIG_SIZE}
        type={FIELD_TYPE.FLOOR}
        level={1}
        field={new Field("idd", FIELD_TYPE.FLOOR, 1, {})}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
