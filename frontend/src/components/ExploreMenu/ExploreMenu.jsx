import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";
const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and your dining experience,one
        delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          // Get the normalized menu name
          const normalizedMenuName = item.menu_name.toLowerCase().trim();

          return (
            <div
              onClick={() =>
                setCategory(prev =>
                  // Compare the previous state (which is now lowercase)
                  prev === normalizedMenuName ? "All" : normalizedMenuName
                )
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                // The 'category' prop passed here is the lowercase value from state
                className={category === normalizedMenuName ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;