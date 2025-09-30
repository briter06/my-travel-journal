import { v4 } from 'uuid';

export const createMarker = (
  colorMarker = 'red',
  icon = 'circle-fill',
  colorIcon = 'white',
) => {
  const uuid = v4();
  return `
<html lang="en">
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
    />
    <style>
      #body-icon-${uuid} {
        background-color: #f0f0f0;
      }

      .icon-stack-${uuid} {
        position: absolute;
      }

      .icon-stack-${uuid} .base-icon {
        font-size: 32px; /* biggest icon */
        color: ${colorMarker};
      }

      .icon-stack-${uuid} .middle-icon {
        position: absolute;
        top: 8px; /* vertical offset */
        left: 50%;
        font-size: 18px; /* smaller than base */
        color: ${colorMarker};
      }

      .icon-stack-${uuid} .top-icon {
        position: absolute;
        top: 12px; /* vertical offset on top of middle */
        left: 50%;
        font-size: 10px; /* smallest icon */
        color: ${colorIcon};
      }
    </style>
  </head>
  <body id="body-icon-${uuid}">
    <div class="icon-stack-${uuid}">
      <i class="bi bi-geo-alt-fill base-icon"></i>
      <i class="bi bi-circle-fill middle-icon"></i>
      <i class="bi bi-${icon} top-icon"></i>
    </div>
  </body>
</html>
`;
};
