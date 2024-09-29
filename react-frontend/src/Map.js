import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Highcharts, { Options } from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import './map.css';
import { fetchAlerts } from "./api";

// Define the default icon for Leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const ExternalLinkIcon = () => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20px"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / External_Link"> <path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
`;

const Map = () => {
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [bleachedCoralData, setBleachedCoralData] = useState([]);
  const [averageTempData, setAverageTempData] = useState([]);
  const [recentMarkers, setRecentMarkers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Clean up existing map instances
    const container = L.DomUtil.get("map");
    if (container != null) {
      container._leaflet_id = null;
    }
    const alertsData = [
      { id: 1, status: "Good", description: "Marker 1 is healthy Marker 1 is healthy Marker 1 is healthy Marker 1 is healthyMarker 1 is healthyMarker 1 is healthy", markerId: 1 },
      { id: 2, status: "Bad", description: "Marker 2 is bleached", markerId: 2 },
      { id: 3, status: "Good", description: "Marker 3 is healthy", markerId: 3 },
    ];
    // const alertsData = fetchAlerts();
    // console.log(alertsData + "- alertaData");
    setAlerts(alertsData);
    // Initialize the Leaflet map without zoom controls
    const map = L.map("map", {
      zoomControl: false, // Disable zoom controls
      maxBounds: [
        [-90, -180], // Southwest coordinates
        [90, 180]    // Northeast coordinates
      ],
      maxBoundsViscosity: 1.0 // Sets how firmly the map sticks to the defined bounds (1.0 = strict)
    }).setView([51.505, -0.09], 6);

    mapRef.current = map;


    // Add a tile layer using Mapbox styles
    L.tileLayer(
      "https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          "pk.eyJ1IjoidGFyLWhlbCIsImEiOiJjbDJnYWRieGMwMTlrM2luenIzMzZwbGJ2In0.RQRMAJqClc4qoNwROT8Umg",
      }
    ).addTo(map);

    // Set the default icon for all markers
    L.Marker.prototype.options.icon = DefaultIcon;

    // Fetch marker data
    const fetchData = async () => {
      try {
        // Dummy data for bleached coral detection over time
        const coralData = [
          { date: "2023-09-01", value: 50 },
          { date: "2023-09-02", value: 55 },
          { date: "2023-09-03", value: 70 },
          { date: "2023-09-04", value: 80 },
          { date: "2023-09-05", value: 60 },
          { date: "2023-09-06", value: 90 },
          { date: "2023-09-07", value: 85 },
        ];



        const processedCoral = {
          chart: {
            backgroundColor: 'transparent', // Make the background transparent
          },
          title: {
            text: 'Coral Bleached Over Time',
            style: {
              color: '#FFFFFF', // Make title text white
              fontWeight: 'bold'
            }
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Date',
              style: {
                color: '#FFFFFF', // Make X-axis title white
                fontWeight: 'bold'
              }
            },
            tickInterval: 24 * 3600 * 1000, // One day
            dateTimeLabelFormats: {
              day: '%m-%d', // Format for the day
            },
            labels: {
              rotation: -45, // Rotate labels for better visibility
              align: 'right', // Align labels to the right
              style: {
                color: '#FFFFFF', // Make X-axis labels white
                fontWeight: 'bold'
              }
            },
            lineColor: '#FFFFFF', // Make X-axis line white
            tickColor: '#FFFFFF'  // Make X-axis ticks white
          },
          yAxis: {
            title: {
              text: '% Bleached',
              style: {
                fontWeight: 'bold',
                color: '#FFFFFF' // Make Y-axis title white
              }
            },
            labels: {
              style: {
                fontWeight: 'bold',
                color: '#FFFFFF' // Make Y-axis labels white
              }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.2)', // Optionally, make gridlines subtle white
            lineColor: '#FFFFFF', // Make Y-axis line white
            tickColor: '#FFFFFF'  // Make Y-axis ticks white
          },
          series: [{
            name: '% Bleached',
            fontWeight: 'bold',
            data: coralData.map(item => [new Date(item.date).getTime(), item.value]),
            type: 'line',
            color: '#d46b16', // Make the line white
            tooltip: {
              valueSuffix: '%',
            },
            lineWidth: 5, // Increase the line thickness
            marker: {
              lineColor: '#d46b16' // Make marker outline white
            }
          }],
          tooltip: {
            shared: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Adjust tooltip background color
            style: {
              color: '#333' // Optional: Adjust tooltip text color
            }
          },
          plotOptions: {
            series: {
              marker: {
                enabled: true,
                fillColor: '#FFFFFF' // Make marker fill white
              }
            }
          }
        };

        setBleachedCoralData(processedCoral);

        // Dummy data for average temperature over time

        
        const tempData = [
          { date: "2023-09-01", value: 25 },
          { date: "2023-09-02", value: 26 },
          { date: "2023-09-03", value: 27 },
          { date: "2023-09-04", value: 28 },
          { date: "2023-09-05", value: 27 },
          { date: "2023-09-06", value: 29 },
          { date: "2023-09-07", value: 30 },
        ];


        

        const processedTemp = {
          chart: {
            backgroundColor: 'transparent', // Make the background transparent
          },
          title: {
            text: 'Average Coral Temperature Over Time',
            style: {
              fontWeight: 'bold',
              color: '#FFFFFF' // Make title text white
            }
          },
          xAxis: {
            type: 'datetime',
            title: {
              text: 'Date',
              style: {
                fontWeight: 'bold',
                color: '#FFFFFF' // Make X-axis title white
              }
            },
            tickInterval: 24 * 3600 * 1000, // One day
            dateTimeLabelFormats: {
              day: '%m-%d', // Format for the day
            },
            labels: {
              rotation: -45, // Rotate labels for better visibility
              align: 'right', // Align labels to the right
              style: {
                fontWeight: 'bold',
                color: '#FFFFFF' // Make X-axis labels white
              }
            },
            lineColor: '#FFFFFF', // Make X-axis line white
            tickColor: '#FFFFFF'  // Make X-axis ticks white
          },
          yAxis: {
            title: {
              text: 'Temperature (°C)',
              style: {
                fontWeight: 'bold',
                color: '#FFFFFF' // Make Y-axis title white
              }
            },
            labels: {
              style: {
                color: '#FFFFFF' // Make Y-axis labels white
              }
            },
            gridLineColor: 'rgba(255, 255, 255, 0.2)', // Optionally, make gridlines subtle white
            lineColor: '#FFFFFF', // Make Y-axis line white
            tickColor: '#FFFFFF'  // Make Y-axis ticks white
          },
          series: [{
            name: 'Temperature',
            data: tempData.map(item => [new Date(item.date).getTime(), item.value]),
            type: 'line',
            color: '#d46b16', // Make the line white
            tooltip: {
              valueSuffix: ' °C',
            },
            lineWidth: 5,
            marker: {
              lineColor: '#FFFFFF' // Make marker outline white
            }
          }],
          tooltip: {
            shared: true,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // Optional: Adjust tooltip background color
            style: {
              color: '#333' // Optional: Adjust tooltip text color
            }
          },
          plotOptions: {
            series: {
              marker: {
                enabled: true,
                fillColor: '#FFFFFF' // Make marker fill white
              }
            }
          }
        };
        setAverageTempData(processedTemp);

        // Dummy data for recent markers
        const markersData = [
          { id: 1, name: "Bleached Coral A", lat: 51.505, lng: -0.09, classification: 1 },
          { id: 2, name: "Bleached Coral B", lat: 51.51, lng: -0.1, classification: 0 },
          { id: 3, name: "Bleached Coral C", lat: 51.52, lng: -0.08, classification: 1 },
          { id: 4, name: "Bleached Coral D", lat: 51.54, lng: -0.08, classification: 1 },
        ];
        setRecentMarkers(markersData);

        // Add markers to the map
        markersData.forEach((markerData) => {
          const { lat, lng, name, classification } = markerData;
          const marker = L.marker([lat, lng], {
            icon: L.icon({
              iconUrl: classification
                ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"
                : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
            }),
          }).addTo(map);

          const markerInfoLink = `/marker/${markerData.id}`; // Link to your component

          const popupContent = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-weight: bold;">${name}</span>
              <a href="${markerInfoLink}" target="_blank" style="text-decoration: none; color: black;">
                ${ExternalLinkIcon()}
              </a>
            </div>
            <iframe 
              src="https://your-custom-stream-url.com/live-stream" 
              width="300" 
              height="200" 
              frameborder="0" 
              allowfullscreen
              style="border:0;"
            ></iframe><br>
          `;

          // Bind the popup with the customized content
          marker.bindPopup(popupContent);
        });
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    };

    // Fetch markers
    fetchData();

    // Cleanup map on component unmount
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const focusMarker = (markerId) => {
    const marker = recentMarkers.find(m => m.id === markerId);
    if (marker) {
      mapRef.current.setView([marker.lat, marker.lng], 13); // Adjust zoom level as needed
    }
  };
  // Toggle the visibility of the dashboard
  const toggleDashboard = () => {
    setIsDashboardVisible((prev) => !prev);
  };

  return (
    <div style={{ display: "flex", flexDirection: isDashboardVisible ? "row" : "row-reverse" }}>
      {isDashboardVisible && (
        <div style={{
          width: "35%",
          height: "100vh",
          backgroundImage: "url('bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "10px",
          boxSizing: "border-box",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <h1 style={{ color: "#FFFFFF", textAlign: "center", width: "100%", marginTop: "30px", marginBottom: "8px" }}>QUORAL Dashboard</h1>
          <h2 style={{ color: "#FFFFFF", textAlign: "center", fontSize: "20px", margin: "8px 0" }}>Alerts</h2>

          {/* Alerts Section */}
          <div style={{ width: "100%", marginBottom: "20px" }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => focusMarker(alert.markerId)}
                style={{
                  border: "1px solid white", // Black border
                  color: "white", // Text color
                  padding: "5px",
                  marginBottom: "3px",
                  cursor: "pointer",
                  display: "flex", // Flex to align items
                  alignItems: "center", // Center vertically
                  fontSize: "1em", // Smaller text size
                  transition: "background-color 0.3s, color 0.3s", // Transition for hover effects
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; // Light hover effect
                  e.currentTarget.style.color = "black"; // Change text color on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"; // Remove hover effect
                  e.currentTarget.style.color = "white"; // Revert text color
                }}
              >
                {/* Dot indicator based on alert status */}
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: alert.status === "Good" ? "#005700" : "red", // Dot color
                    marginRight: "8px", // Space between dot and text
                  }}
                />
                <span style={{ flex: 1, textAlign: "left" }}>{alert.description}</span> {/* Align text to the left */}
              </div>
            ))}
          </div>


          <div style={{ width: "100%", height: "100%" }}>
            <HighchartsReact highcharts={Highcharts} options={bleachedCoralData} containerProps={{ style: { height: "99%" } }} />
          </div>
          <div style={{ width: "100%", height: "100%" }}>
            <HighchartsReact highcharts={Highcharts} options={averageTempData} containerProps={{ style: { height: "99%" } }} />
          </div>
        </div>
      )}

      <div id="map" style={{ height: "100vh", width: isDashboardVisible ? "70%" : "100%" }}></div>
    </div>
  );
};

export default Map;
