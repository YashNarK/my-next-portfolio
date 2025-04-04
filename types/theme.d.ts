// theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    professional: React.CSSProperties;
    playful: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    professional?: React.CSSProperties;
    playful?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    professional: true;
    playful: true;
  }
}
