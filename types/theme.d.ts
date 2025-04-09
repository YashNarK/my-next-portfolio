// theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    professional: React.CSSProperties;
    playful: React.CSSProperties;
    codeLike: React.CSSProperties;
    handWritten: React.CSSProperties;
  }
}

interface TypographyVariantsOptions {
  professional?: React.CSSProperties;
  playful?: React.CSSProperties;
  codeLike?: React.CSSProperties;
  handWritten?: React.CSSProperties;
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    professional: true;
    playful: true;
    codeLike: true;
    handWritten: true;
  }
}
