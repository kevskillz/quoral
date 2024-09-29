import React, { useEffect, useState } from 'react';
import './Landing.css';
import DownArrow from './darr.svg'; // Update the path as necessary
import Lottie from 'lottie-react';
import animationData from './fish.json'; // Adjust the path to your animation JSON file
import { Link } from 'react-router-dom';

function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [showFish, setShowFish] = useState(true);

  console.log(scrollY);

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      if (currentScrollY > 0 && !showFish) {
        setShowFish(true); // Show fish once user starts scrolling
      }
    }, 50); // Adjust delay as needed

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showFish]); // Only depend on showFish

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const goToDemo = () => {
    // Replace '/demo' with the path to your demo page
    window.location.href = '/demo'; // Change this to your actual demo URL
  };

  // Generate an array of fish for rendering multiple instances
  const renderFish = () => {
    if (!showFish) return null; // Return null if fish should not be shown

    // Define an array of positions for even distribution
    const positions = [
      { left: '5%', bottom: '5vh' },   // Top left
      { left: '10%', bottom: '20vh' },  // Mid left
      { left: '15%', bottom: '10vh' },  // Top left
      { left: '20%', bottom: '40vh' },  // Mid left
      { left: '25%', bottom: '35vh' },  // Mid left
      { left: '30%', bottom: '80vh' },  // Bottom left
      { left: '35%', bottom: '15vh' },  // Top left
      { left: '40%', bottom: '50vh' },  // Mid left
      { left: '50%', bottom: '5vh' },   // Top center
      { left: '55%', bottom: '90vh' },  // Bottom center
      { left: '60%', bottom: '20vh' },  // Mid left
      { left: '70%', bottom: '10vh' },  // Top right
      { left: '75%', bottom: '80vh' },  // Bottom right
      { left: '80%', bottom: '30vh' },  // Mid right
      { left: '85%', bottom: '25vh' },  // Mid right
      // { left: '90%', bottom: '10vh' },  // Top right
      // { left: '95%', bottom: '70vh' },  // Bottom right
    ];

    return positions.map((position, index) => (
      <div
        key={index}
        className={`fish ${showFish ? 'visible' : ''}`} // Use showFish state to control visibility
        style={{
          position: 'absolute',
          left: position.left, // Use predefined left position
          bottom: position.bottom, // Use predefined bottom position
        }}
      >
        <Lottie animationData={animationData} loop={true} style={{ width: 200, height: 200 }} />
      </div>
    ));
  };

  return (
    <div className="App">
      <section className="landing-section">
        {renderFish()}
        <h1 className={`scroll-text ${scrollY === 0 ? 'fade-in' : ''}`}>QUORAL</h1>
        <p className={`scroll-text ${scrollY === 0 ? 'fade-in' : ''}`}>An ML-Based Coral Monitoring System</p>
        <Link to="login" className="demo-button" style={{marginTop: "10px"}}>
          Log In
        </Link>
        <div className="scroll-arrow" onClick={scrollDown}>
          
          <img src={DownArrow} alt="Scroll down" width="40" height="40" />
        </div>


      </section>

      <section className="content-section">
        <div className="column left">
          <h2 className={`scroll-text ${scrollY > 300 ? 'fade-in' : ''}`}>The Importance of Coral Reefs</h2>
        </div>
        <div className="column right">
          <p className={`scroll-text ${scrollY > 300 ? 'fade-in' : ''}`}>
            Coral reefs are vital ecosystems that support a staggering variety of marine life, serving as crucial habitats for countless species. They protect coastlines from erosion, provide resources for local communities, and contribute significantly to global biodiversity. However, coral reefs are facing unprecedented threats from climate change, pollution, and overfishing, leading to alarming rates of degradation. Preserving these underwater wonders is essential not only for marine health but also for the well-being of human populations reliant on them for food and economic stability.
          </p>
          <div className="scroll-arrow" onClick={scrollDown}>
            <img src={DownArrow} alt="Scroll to next section" width="40" height="40" />
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="column left">
          <h2 className={`scroll-text ${scrollY > 1200 ? 'fade-in' : ''}`}>Introducing QUORAL</h2>
        </div>
        <div className="column right">
          <p className={`scroll-text ${scrollY > 1200 ? 'fade-in' : ''}`}>
            Our innovative product is a machine learning-based coral reef monitoring system designed to safeguard these fragile ecosystems. At the heart of our solution is a waterproof robot equipped with a high-resolution camera and a temperature sensor, enabling real-time monitoring of coral health and environmental conditions. By leveraging advanced machine learning algorithms, the system analyzes data to detect potential threats and problems with coral reefs, empowering conservationists and researchers with actionable insights. With our monitoring system, we aim to contribute to the preservation of coral reefs and foster a sustainable future for marine life.
          </p>

        </div>

      </section>



    </div>
  );
}

export default Landing;
