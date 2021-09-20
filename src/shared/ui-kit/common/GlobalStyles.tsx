import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: "Agrandir";
    src: local("Agrandir"),
      url("assets/fonts/Agrandir/Agrandir-Regular.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir Variable";
    src: local("Agrandir Variable"),
      url("assets/fonts/Agrandir/Agrandir Variable.ttf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir Grand";
    src: local("Agrandir Grand"),
      url("assets/fonts/Agrandir/Agrandir-Grand.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir GrandHeavy";
    src: local("Agrandir GrandHeavy"),
      url("assets/fonts/Agrandir/Agrandir-GrandHeavy.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir GrandItalic";
    src: local("Agrandir GrandItalic"),
      url("assets/fonts/Agrandir/Agrandir-GrandItalic.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir GrandLight";
    src: local("Agrandir GrandLight"),
      url("assets/fonts/Agrandir/Agrandir-GrandLight.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir Italic";
    src: local("Agrandir Italic"),
      url("assets/fonts/Agrandir/Agrandir-Grand.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir Narrow";
    src: local("Agrandir Narrow"),
      url("assets/fonts/Agrandir/Agrandir-Narrow.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir NarrowBlack";
    src: local("Agrandir NarrowBlack"),
      url("assets/fonts/Agrandir/Agrandir-NarrowBlack.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir Regular";
    src: local("Agrandir Regular"),
      url("assets/fonts/Agrandir/Agrandir-Regular.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir TextBold";
    src: local("Agrandir TextBold"),
      url("assets/fonts/Agrandir/Agrandir-TextBold.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir ThinItalic";
    src: local("Agrandir ThinItalic"),
      url("assets/fonts/Agrandir/Agrandir-ThinItalic.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir Tight";
    src: local("Agrandir Tight"),
      url("assets/fonts/Agrandir/Agrandir-Tight.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir TightBlack";
    src: local("Agrandir TightBlack"),
      url("assets/fonts/Agrandir/Agrandir-TightBlack.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir TightThin";
    src: local("Agrandir TightThin"),
      url("assets/fonts/Agrandir/Agrandir-TightThin.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir WideBlackItalic";
    src: local("Agrandir WideBlackItalic"),
      url("assets/fonts/Agrandir/Agrandir-WideBlackItalic.otf") format("truetype");
  }

  @font-face {
    font-family: "Agrandir WideLight";
    src: local("Agrandir WideLight"),
      url("assets/fonts/Agrandir/Agrandir-WideLight.otf") format("truetype");
  }

  body, * {
    font-family: "Agrandir", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
