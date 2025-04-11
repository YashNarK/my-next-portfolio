// theme.d.ts
import "@mui/material/styles";

declare module "@mui/material/styles" {
  // Extended for palettes
  interface SocialPaletteColor {
    color: string;
    backgroundColor: string;
    iconColor: string;
  }

  interface Palette {
    social: {
      github: SocialPaletteColor;
      instagram: SocialPaletteColor;
      linkedin: SocialPaletteColor;
      mail: SocialPaletteColor;
    };
  }

  interface PaletteOptions {
    social?: {
      github?: SocialPaletteColor;
      instagram?: SocialPaletteColor;
      linkedin?: SocialPaletteColor;
      mail?: SocialPaletteColor;
    };
  }

  // Extended for typography
  interface TypographyVariants {
    professional: React.CSSProperties;
    playful: React.CSSProperties;
    codeLike: React.CSSProperties;
    handWritten: React.CSSProperties;
    caligraphy: React.CSSProperties;
  }
}

interface TypographyVariantsOptions {
  professional?: React.CSSProperties;
  playful?: React.CSSProperties;
  codeLike?: React.CSSProperties;
  handWritten?: React.CSSProperties;
  caligraphy?: React.CSSProperties;
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    professional: true;
    playful: true;
    codeLike: true;
    handWritten: true;
    caligraphy: true;
  }
}
