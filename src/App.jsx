import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { gsap } from 'gsap';

function App() {
  const ctaButtonRef = useRef(null);
  const textContainerRef = useRef(null);
  const blueCircleRef = useRef(null);
  const mainDishRef = useRef(null);
  const mainDishImageRef = useRef(null);
  const orbitDishesRef = useRef([]);
  const halfCircleArcRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const textBlocks = [
    {
      title: "Lorem Ipsum",
      subtitle: "Lorem Ipsum dolor",
      description: "Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Duis tellus. Donec ante dolor, iaculis nec, gravida ac.",
      titleColor: "#D49D42",
      buttonBg: "linear-gradient(135deg, #D49D42, #B8722C)"
    },
    {
      title: "Lorem Ipsum",
      subtitle: "Amazing Taste",
      description: "Experience the finest culinary delights with our carefully crafted dishes that bring joy to every meal.",
      titleColor: "#7ED321",
      buttonBg: "linear-gradient(135deg, #7ED321, #4A7C59)"
    },
    {
      title: "Lorem Ipsum",
      subtitle: "Quality Assured",
      description: "We source only the freshest ingredients to ensure every dish meets our high standards of excellence.",
      titleColor: "#FF6B6B",
      buttonBg: "linear-gradient(135deg, #FF6B6B, #E55353)"
    },
    {
      title: "Lorem Ipsum",
      subtitle: "Customer First",
      description: "Our dedicated team ensures exceptional service and memorable dining experiences for every guest.",
      titleColor: "#4ECDC4",
      buttonBg: "linear-gradient(135deg, #4ECDC4, #44A08D)"
    }
  ];

  const dishImages = [
    '/menu-2.png', // dish-1
    '/menu-3.png', // dish-2
    '/menu-4.png', // dish-3
    '/menu-5.png', // dish-4
    '/menu-2.png'  // dish-5
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentBackgroundPosition, setCurrentBackgroundPosition] = useState({ x: 50, y: 50 });
  const [currentMainDishIndex, setCurrentMainDishIndex] = useState(-1); // -1 indicates the initial main dish (/menu-1.png)

  useEffect(() => {
    // Set initial state for all text blocks
    const textBlocks = textContainerRef.current?.children;
    if (textBlocks) {
      gsap.set(textBlocks, { y: 0, opacity: 0 });
      gsap.set(textBlocks[currentTextIndex], { y: 0, opacity: 1 });
    }
  }, []);

  const getRandomDirection = () => {
    const directions = [
      { x: -30, y: 0, name: 'left' },
      { x: 30, y: 0, name: 'right' },
      { x: 0, y: 30, name: 'down' },
      { x: -20, y: 20, name: 'left-down' },
      { x: 20, y: 20, name: 'right-down' },
      { x: -20, y: -20, name: 'left-up' },
      { x: 20, y: -20, name: 'right-up' }
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  const animateGalaxyBackground = () => {
    if (!blueCircleRef.current) return;

    const randomDirection = getRandomDirection();
    
    let newX = currentBackgroundPosition.x + randomDirection.x;
    let newY = currentBackgroundPosition.y + randomDirection.y;
    
    newX = Math.max(0, Math.min(100, newX));
    newY = Math.max(0, Math.min(100, newY));
    
    gsap.to(blueCircleRef.current, {
      duration: 1.2,
      ease: "power2.inOut",
      backgroundPosition: `${newX}% ${newY}%`,
      onComplete: () => {
        setCurrentBackgroundPosition({ x: newX, y: newY });
      }
    });
  };

  const handleArrowClick = (direction) => {
    const textBlocks = textContainerRef.current?.children;
    if (!textBlocks || !mainDishRef.current || !mainDishImageRef.current || !orbitDishesRef.current) return;

    const nextTextIndex = (currentTextIndex + 1) % textBlocks.length;
    const currentBlock = textBlocks[currentTextIndex];
    const nextBlock = textBlocks[nextTextIndex];

    // Update main dish index
    let nextMainDishIndex;
    if (direction === 'left') {
      nextMainDishIndex = (currentMainDishIndex - 1 + dishImages.length) % dishImages.length;
    } else {
      nextMainDishIndex = (currentMainDishIndex + 1) % dishImages.length;
    }

    const selectedOrbitDish = orbitDishesRef.current[nextMainDishIndex];
    if (!selectedOrbitDish) return;

    const mainDishRect = mainDishRef.current.getBoundingClientRect();
    const selectedDishRect = selectedOrbitDish.getBoundingClientRect();
    const contentRightRect = mainDishRef.current.parentElement.getBoundingClientRect();

    const mainDishCenterX = mainDishRect.left + mainDishRect.width / 2 - contentRightRect.left;
    const mainDishCenterY = mainDishRect.top + mainDishRect.height / 2 - contentRightRect.top;
    const orbitDishCenterX = selectedDishRect.left + selectedDishRect.width / 2 - contentRightRect.left;
    const orbitDishCenterY = selectedDishRect.top + selectedDishRect.height / 2 - contentRightRect.top;

    const tl = gsap.timeline();

    gsap.set(nextBlock, { y: 50, opacity: 0 });
    tl.to(currentBlock, {
      y: -50,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
    .to(nextBlock, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 0.2);

    // Dish animation
    tl.to(mainDishImageRef.current, {
      x: orbitDishCenterX - mainDishCenterX,
      y: orbitDishCenterY - mainDishCenterY,
      scale: 0.41,
      duration: 0.6,
      ease: 'back.inOut(1.7)'
    }, 0);

    // Move orbit dish to main dish position and scale up
    tl.to(selectedOrbitDish.querySelector('img'), {
      x: mainDishCenterX - orbitDishCenterX,
      y: mainDishCenterY - orbitDishCenterY,
      scale: 2.44,
      duration: 0.6,
      ease: 'back.inOut(1.7)'
    }, 0);

    tl.call(() => {
      // Swap image sources
      const mainDishImg = mainDishImageRef.current.src;
      mainDishImageRef.current.src = selectedOrbitDish.querySelector('img').src;
      selectedOrbitDish.querySelector('img').src = mainDishImg;

      gsap.set(mainDishImageRef.current, { x: 0, y: 0, scale: 1 });
      gsap.set(selectedOrbitDish.querySelector('img'), { x: 0, y: 0, scale: 1 });

      setCurrentMainDishIndex(nextMainDishIndex);
      setCurrentTextIndex(nextTextIndex);
    }, null, 0.6);

    animateGalaxyBackground();
  };

  const handleMainDishMouseEnter = () => {
    const tl = gsap.timeline();
    
    tl.to(mainDishImageRef.current, {
      scale: 1.4,
      duration: 0.6,
      ease: "back.out(1.7)"
    });

    const mainDishRect = mainDishRef.current?.getBoundingClientRect();
    const contentRightRect = mainDishRef.current?.parentElement.getBoundingClientRect();
    
    orbitDishesRef.current.forEach((dish, index) => {
      if (dish && mainDishRect && contentRightRect) {
        const dishRect = dish.getBoundingClientRect();
        
        const deltaX = (mainDishRect.left + mainDishRect.width/2) - (dishRect.left + dishRect.width/2);
        const deltaY = (mainDishRect.top + mainDishRect.height/2) - (dishRect.top + dishRect.height/2);
        
        tl.to(dish, {
          x: deltaX * 0.8,
          y: deltaY * 0.8,
          scale: 0.7,
          duration: 0.5,
          ease: "power2.out",
          zIndex: 1
        }, 0.1 + index * 0.03);
      }
    });

    if (halfCircleArcRef.current) {
      tl.to(halfCircleArcRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out"
      }, 0.1);
    }
  };

  const handleMainDishMouseLeave = () => {
    const tl = gsap.timeline();
    
    tl.to(mainDishImageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.2)"
    });

    orbitDishesRef.current.forEach((dish, index) => {
      if (dish) {
        tl.to(dish, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.2)",
          zIndex: 2
        }, 0.1 + index * 0.03);
      }
    });

    if (halfCircleArcRef.current) {
      tl.to(halfCircleArcRef.current, {
        opacity: 0.8,
        duration: 0.4,
        ease: "power2.out"
      }, 0.1);
    }
  };

  const addToOrbitRefs = (el, index) => {
    if (el && !orbitDishesRef.current.includes(el)) {
      orbitDishesRef.current[index] = el;
    }
  };

  const handleLockClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <div className="app">
      <div className="blue-circle" ref={blueCircleRef}></div>
      <header className="header">
        <div className="logo">
          <div className="logo-icon"></div>
          <span>LOGO</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link">Breakfast</a>
          <a href="#" className="nav-link">Lunch</a>
          <a href="#" className="nav-link">Dinner</a>
        </nav>
        <div className="lock-icon-container">
          <div className="lock-icon" onClick={handleLockClick}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17C12.55 17 13 16.55 13 16C13 15.45 12.55 15 12 15C11.45 15 11 15.45 11 16C11 16.55 11.45 17 12 17ZM18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 3C13.66 3 15 4.34 15 6V8H9V6C9 4.34 10.34 3 12 3ZM18 20H6V10H18V20Z" fill="currentColor"/>
            </svg>
          </div>
          {isDropdownOpen && (
            <div className="dropdown">
              <button className="dropdown-item" onClick={handleLoginClick}>
                Login
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="main-content">
        <div className="content-left">
          <div className="text-content-wrapper">
            <div className="text-container" ref={textContainerRef}>
              {textBlocks.map((textBlock, index) => (
                <div 
                  key={index} 
                  className={`text-block ${index === currentTextIndex ? 'active' : ''}`}
                  style={{ 
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                  }}
                >
                  <h1 
                    className="main-title" 
                    style={{ color: textBlock.titleColor }}
                  >
                    {textBlock.title}
                  </h1>
                  <h2 className="sub-title">{textBlock.subtitle}</h2>
                  <p className="description">
                    {textBlock.description}
                  </p>
                </div>
              ))}
            </div>
            <button 
              className="cta-button" 
              ref={ctaButtonRef}
              style={{ 
                background: textBlocks[currentTextIndex].buttonBg,
                color: '#FFFFFF'
              }}
            >
              Baatcheet kare
            </button>
          </div>
        </div>
        <div className="content-right">
          <div className="half-circle-arc" ref={halfCircleArcRef}></div>
          <div 
            className="main-dish" 
            ref={mainDishRef}
          >
            <img 
              src="/menu-1.png" 
              alt="Main dish" 
              ref={mainDishImageRef} 
              onMouseEnter={handleMainDishMouseEnter}
              onMouseLeave={handleMainDishMouseLeave}
            />
           <div className="scroll-indicator left" onClick={() => handleArrowClick('left')}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</div>
<div className="scroll-indicator right" onClick={() => handleArrowClick('right')}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</div>
          </div>
          {dishImages.map((src, index) => (
            <div 
              key={index} 
              className={`orbit-dish dish-${index + 1}`} 
              ref={el => addToOrbitRefs(el, index)}
            >
              <img src={src} alt={`Food item ${index + 1}`} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;