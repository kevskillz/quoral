// // api.js
// const BASE_URL = 'https://your-api-url.com'; // Replace with your actual API URL

// // Function to fetch average temperature data
// export const fetchAverageTemperature = async (markerId) => {
//     try {
//         const response = await fetch(`${BASE_URL}/markers/${markerId}/average-temperature`);
//         if (!response.ok) {
//             throw new Error(`Error fetching average temperature: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// // Function to fetch bleached coral status
// export const fetchBleachedCoralStatus = async (markerId) => {
//     try {
//         const response = await fetch(`${BASE_URL}/markers/${markerId}/bleached-status`);
//         if (!response.ok) {
//             throw new Error(`Error fetching bleached coral status: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };
// // Function to fetch recent markers data
// export const fetchVideoURL = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/markers/${markerId}/stream-url`);
//         if (!response.ok) {
//             throw new Error(`Error fetching stream: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };



// // Function to fetch coral bleaching data
// export const fetchCoralBleachingData = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/bleaching-data`);
//         if (!response.ok) {
//             throw new Error(`Error fetching bleached coral data: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// // Function to fetch average temperature data
// export const fetchAverageTemperatureData = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/temperature-data`);
//         if (!response.ok) {
//             throw new Error(`Error fetching avg temp data: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// // Function to fetch recent markers data
// export const fetchRecentMarkers = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/markers/`);
//         if (!response.ok) {
//             throw new Error(`Error fetching recent markers: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// // Function to fetch recent markers data
// export const fetchAlerts = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/alerts/`);
//         if (!response.ok) {
//             throw new Error(`Error fetching alerts: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };





