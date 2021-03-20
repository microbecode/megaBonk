import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Line } from "react-chartjs-2";

import "../../styles/statistics.scss";

export function Statistics() {
  const data = (canvas: any) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(
      canvas.width / 2,
      0,
      canvas.width / 2,
      canvas.height,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.11)");
    gradient.addColorStop(1, "rgba(201, 201, 201, 0)");

    return {
      labels: [
        "12 Feb 2021",
        "13 Feb 2021",
        "14 Feb 2021",
        "15 Feb 2021",
        "16 Feb 2021",
        "17 Feb 2021",
      ],
      datasets: [
        {
          label: "$",
          data: [0.13, 0.2, 0.08, 0.15, 0.3, 0.25],
          backgroundColor: gradient,
          borderColor: "#09D1B7",
          borderWidth: 1,
          //steppedLine: true,
          pointHoverBorderColor: "#09D1B7",
          pointHoverBackgroundColor: "#171717",
          pointHoverRadius: 15,
          pointHoverBorderWidth: 2,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
        },
      ],
    };
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    legend: {
      display: false,
    },
    elements: {
      line: {
        tension: 0, // disables bezier curves
      },
    },
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    tooltips: {
      backgroundColor: "#2A2A2A",
      titleFontColor: "#DF54FC",
    },
    scales: {
      yAxes: [
        {
          display: false,
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: false,
          },
        },
      ],
      xAxes: [
        {
          display: false,
          scaleLabel: {
            display: true,
          },
        },
      ],
    },
  };

  return (
    <div className="statistics-container mt-4 text-left">
      <Container fluid>
        <div className="bonked">
          <Row>
            <Col>
              <h1 className="text-uppercase text-center">Network Statistics</h1>
            </Col>
          </Row>
          <Row className="mt-4 px-5">
            <Col>
              <p>Token Supply</p>
              <p className="green">3,000,000</p>
            </Col>
            <Col>
              <p>Price change 24H</p>
              <p className="purple">-25.068 %</p>
            </Col>
            <Col>
              <p>Current Market Price</p>
              <p className="pink">$ 0.134</p>
            </Col>
            <Col>
              <p>Market Cap</p>
              <p className="green">$ 400,557</p>
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
            <Line data={data} options={options} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
