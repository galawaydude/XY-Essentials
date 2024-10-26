import React, { useEffect, useState } from 'react';
import './combo.css'; // You can create a CSS file for styling if needed

const Combo = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/combos'); // Update with your correct endpoint
        if (response.ok) {
          const data = await response.json();
          setCombos(data);
        } else {
          console.error('Error fetching combos:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching combos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="combo-container">
      <h1>Combos</h1>
      <div className="combo-section">
        {combos.map(combo => (
          <div key={combo._id} className="combo">
            <h2>{combo.name}</h2>
            <div className="products">
              {combo.products.map(product => (
                <div key={product._id} className="product">
                  <img src={product.images[0]} alt={product.name} />
                  <h3>{product.name}</h3>
                  {/* <p>{product.description}</p> */}
                  <p>Price: ${product.price}</p>
                </div>
              ))}
            </div>
            <p>Combined Price: ${combo.combinedPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Combo;
