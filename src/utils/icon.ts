export const createMarker = (
  colorMarker = "red",
  icon = "circle-fill",
  colorIcon = "white"
) =>
  `
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
    />
    <style>
      body {
        background-color: #f0f0f0;
      }

      .icon-stack {
        position: absolute;
      }

      .icon-stack .base-icon {
        font-size: 32px; /* biggest icon */
        color: ${colorMarker};
      }

      .icon-stack .middle-icon {
        position: absolute;
        top: 8px; /* vertical offset */
        left: 50%;
        font-size: 18px; /* smaller than base */
        color: ${colorMarker};
      }

      .icon-stack .top-icon {
        position: absolute;
        top: 12px; /* vertical offset on top of middle */
        left: 50%;
        font-size: 10px; /* smallest icon */
        color: ${colorIcon};
      }
    </style>
  </head>
  <body>
    <div class="icon-stack">
      <i class="bi bi-geo-alt-fill base-icon"></i>
      <i class="bi bi-circle-fill middle-icon"></i>
      <i class="bi bi-${icon} top-icon"></i>
    </div>
  </body>
</html>
`;
