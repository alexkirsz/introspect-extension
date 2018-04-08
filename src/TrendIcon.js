import React from "react";

export default class TrendIcon extends React.Component {
  render() {
    const props = {
      fill: "none",
      stroke: "#0184ff",
      strokeWidth: 75,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeMiterlimit: 10
    };
    return (
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1324.8 940.6"
        {...this.props}
      >
        <path
          {...props}
          class="st0"
          d="M70.2,758.3c0,0,198.6-362,326.6-358c139.9,4.4,205.9,250.4,365.9,250.4c150,0,263.1-416.4,263.1-416.4l0,0"
        />
        <path
          {...props}
          class="st0"
          d="M1123.9,428.3l-98-194c-66.7,31.3-133.3,62.7-200,94"
        />
        <path
          {...props}
          class="st0"
          d="M1121.9,64.8c-306.3-41.8-612.7-41.8-919,0c-55.4,8.1-117.8,61.9-132.6,117.5c-49,192-49,384,0,576
        c14.8,55.6,77.3,109.4,132.6,117.5c306.3,41.8,612.7,41.8,919,0c55.4-8.1,117.8-61.9,132.6-117.5c49-192,49-384,0-576
        C1239.7,126.7,1177.2,72.9,1121.9,64.8z"
        />
      </svg>
    );
  }
}
