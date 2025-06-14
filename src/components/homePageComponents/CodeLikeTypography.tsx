import {
  Theme,
  Typography,
  TypographyPropsVariantOverrides,
  TypographyVariant,
} from "@mui/material";
import { OverridableStringUnion } from "@mui/types";
import { ReactNode } from "react";
import { ResponsiveStyleValue } from "@mui/system";
import { Property } from "csstype";

type codePropsType = {
  children: ReactNode;
  noRuler?: boolean;
  variant?: OverridableStringUnion<
    TypographyVariant | "inherit",
    TypographyPropsVariantOverrides
  >;
  textColor?: string;
  textAlignment?: ResponsiveStyleValue<Property.TextAlign>;
  display?:
    | ResponsiveStyleValue<Property.Display | readonly string[] | undefined>
    | ((
        theme: Theme
      ) => ResponsiveStyleValue<
        Property.Display | readonly string[] | undefined
      >)
    | null;
};

const CodeLikeTypography = ({
  children,
  noRuler,
  variant = "codeLike",
  display = "block",
  textColor = "",
  textAlignment = "left",
}: codePropsType) => {
  return (
    <Typography
      variant={variant}
      sx={{
        display: display,
        ...(textColor && { color: textColor }),
        fontSize: { xs: "1.1rem", sm: "1.5rem" },
      }}
      textAlign={textAlignment}
    >
      {children}
      {!noRuler && <hr />}
    </Typography>
  );
};

export default CodeLikeTypography;
