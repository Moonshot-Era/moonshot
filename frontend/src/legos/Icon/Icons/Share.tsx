import { IconCommonProps } from "../types";

export const Share = (style: IconCommonProps) => (
  <svg
    width="51"
    height="49"
    viewBox="0 0 51 49"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <g filter="url(#filter0_d_1172_954)">
      <circle cx="24.8324" cy="24" r="24" fill="#49DBC8" />
      <circle cx="24.8324" cy="24" r="23.5" stroke="#49DBC8" />
    </g>
    <path
      d="M20.2325 18.3199L28.7225 15.4899C32.5325 14.2199 34.6025 16.2999 33.3425 20.1099L30.5125 28.5999C28.6125 34.3099 25.4925 34.3099 23.5925 28.5999L22.7525 26.0799L20.2325 25.2399C14.5225 23.3399 14.5225 20.2299 20.2325 18.3199Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.9424 25.6501L26.5224 22.0601"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_d_1172_954"
        x="0.832397"
        y="0"
        width="50"
        height="49"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="2" dy="1" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1172_954"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1172_954"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
