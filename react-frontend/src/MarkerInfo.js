import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useParams, Link } from 'react-router-dom';
import './map.css';

const MarkerInfo = () => {
    const [averageTempData, setAverageTempData] = useState({});
    const [bleachedCoralData, setBleachedCoralData] = useState({});
    const [bleachedPrediction, setBleachedPrediction] = useState({});
    const [zoomedImage, setZoomedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // State for slideshow
    let { id } = useParams();

    const imageUrls = [
        'https://www.w3schools.com/css/paris.jpg',
        'https://i.pinimg.com/736x/eb/c9/af/ebc9afde8c2b05bbf639cfc1c56dc59a.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/4/4e/Sementales_H-B_monchina_400x300.jpg',
    ];


    useEffect(() => {
        // Dummy temperature data for the specific marker
        const tempData = [
            { date: '2023-09-01', value: 25 },
            { date: '2023-09-02', value: 26 },
            { date: '2023-09-03', value: 27 },
            { date: '2023-09-04', value: 28 },
            { date: '2023-09-05', value: 27 },
            { date: '2023-09-06', value: 29 },
            { date: '2023-09-07', value: 30 },
        ];

        // Process temperature data into Highcharts format
        const processedTemp = {
            chart: {
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Average Temperature Over Time',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                tickInterval: 24 * 3600 * 1000,
                dateTimeLabelFormats: { day: '%m-%d' },
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                lineColor: '#FFFFFF',
                tickColor: '#FFFFFF'
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: 'rgba(255, 255, 255, 0.2)',
                lineColor: '#FFFFFF',
                tickColor: '#FFFFFF'
            },
            series: [{
                name: 'Temperature',
                data: tempData.map(item => [new Date(item.date).getTime(), item.value]),
                type: 'line',
                color: '#d46b16',
                tooltip: {
                    valueSuffix: ' °C',
                },
                lineWidth: 5,
                marker: {
                    lineColor: '#FFFFFF'
                }
            }],
            tooltip: {
                shared: true,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                style: {
                    color: '#333'
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                        fillColor: '#FFFFFF'
                    }
                }
            }
        };

        setAverageTempData(processedTemp);

        // Dummy coral bleached status data
        const coralBleachedData = [
            { date: '2023-09-01', value: 0, status: 'Healthy' },
            { date: '2023-09-02', value: 1, status: 'Bleached' },
            { date: '2023-09-03', value: 1, status: 'Bleached' },
            { date: '2023-09-04', value: 0, status: 'Healthy' },
            { date: '2023-09-05', value: 1, status: 'Bleached' },
            { date: '2023-09-06', value: 1, status: 'Bleached' },
            { date: '2023-09-07', value: 0, status: 'Healthy' },
        ];

        // Process coral bleached data into Highcharts format
        const processedCoralBleached = {
            chart: {
                backgroundColor: 'transparent',
            },
            title: {
                text: 'Coral Bleached Over Time',
                style: {
                    color: '#FFFFFF',
                    fontWeight: 'bold'
                }
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                tickInterval: 24 * 3600 * 1000,
                dateTimeLabelFormats: { day: '%m-%d' },
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                lineColor: '#FFFFFF',
                tickColor: '#FFFFFF'
            },
            yAxis: {
                title: {
                    text: 'Bleached Status',
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold'
                    }
                },
                gridLineColor: 'rgba(255, 255, 255, 0.2)',
                categories: ['Healthy', 'Bleached'],
                min: 0,
                max: 1,
                labels: {
                    style: {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    },
                },
            },
            series: [{
                name: 'Temperature',
                fontWeight: 'bold',
                color: '#d46b16',
                data: coralBleachedData.map(item => [new Date(item.date).getTime(), item.value]),
                type: 'scatter',
            }],
            tooltip: { enabled: false },
            plotOptions: {
                series: {
                    marker: { enabled: true, radius: 6 },
                },
            },
        };

        setBleachedCoralData(processedCoralBleached);
        const prediction = { bleached: 1, confidence: 0.98 };
        setBleachedPrediction(prediction);
    }, []);

    // Handle image click to zoom
    const handleImageClick = (imageSrc) => {
        setZoomedImage(imageSrc);
    };

    // Close zoomed image
    const closeZoomedImage = () => {
        setZoomedImage(null);
    };

    // Handle next image in slideshow
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    };

    // Handle previous image in slideshow
    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Floating Back Button */}
            <Link
                to="/map"
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    textDecoration: 'none',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {/* Back Button SVG could go here */}
            </Link>

            {/* Title for Marker ID */}
            <h2 style={{ textAlign: 'center', color: '#FFFFFF', margin: '10px 0' }}>
                Marker {id} Information
            </h2>

            {/* Upper Section Container */}
            <div style={{ display: 'flex', flex: '1', padding: '10px' }}>
                {/* Video Container */}
                <div style={{ width: '50%', height: '100%', position: 'relative' }}>
                    <iframe
                        src="https://your-custom-stream-url.com/live-stream"
                        width="100%"
                        height="100%"
                        style={{
                            border: 0,
                            position: 'absolute',
                            top: 0,
                            left: 10,
                        }}
                        allowFullScreen
                    ></iframe>

                    <div
                        style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '20px',
                            color: '#FFFFFF',
                            border: '2px solid black',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <h3 style={{ margin: '0', fontWeight: 'normal' }}>
                            Most Recent Status:
                            <span
                                style={{
                                    color: bleachedPrediction['bleached'] ? 'red' : 'green',
                                    fontWeight: 'bold',
                                }}
                            >
                                {bleachedPrediction['bleached'] ? ' Bleached' : ' Healthy'}
                            </span>
                        </h3>
                        <p style={{ margin: 0 }}>
                            Confidence: <span style={{ fontWeight: 'bold' }}>{bleachedPrediction['confidence']}</span>
                        </p>
                    </div>
                </div>

                {/* Slideshow Section */}
                <div
                    style={{
                        width: '70%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    {/* Centered Title */}
                    <h2
                        style={{
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                        }}
                    >
                        Past Readings
                    </h2>

                    {/* Image with Navigation Buttons */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            width: '80%',
                            height: '300px',
                        }}
                    >
                        {/* Previous Button */}
                        <button
                            onClick={prevImage}
                            style={{
                                position: 'absolute',
                                left: '0px', // Close to the image
                                fontSize: '50px',
                                fontWeight: 'bold',
                                color: '#FFFFFF',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                zIndex: 10,
                            }}
                        >
                            &lt;
                        </button>

                        {/* Image */}
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt={`Image ${currentImageIndex + 1}`}
                            style={{
                                width: "400px",
                                objectFit: 'cover',
                                borderRadius: '10px',
                            }}
                        />

                        {/* Next Button */}
                        <button
                            onClick={nextImage}
                            style={{
                                position: 'absolute',
                                right: '0px', // Close to the image
                                fontSize: '50px',
                                color: '#FFFFFF',
                                background: 'transparent',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                zIndex: 10,
                            }}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            </div>

            {/* Graphs Section */}
            <div style={{ flex: '1', display: 'flex', padding: '0 5px' }}>
                <div style={{ flex: 1, padding: '0 5px' }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={averageTempData}
                        containerProps={{ style: { height: '99%' } }}
                    />
                </div>
                <div style={{ flex: 1, padding: '0 5px' }}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={bleachedCoralData}
                        containerProps={{ style: { height: '99%' } }}
                    />
                </div>
            </div>
        </div>
    );
};

export default MarkerInfo;