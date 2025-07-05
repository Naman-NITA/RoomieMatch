import { motion, useAnimation } from "framer-motion";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useState } from "react";

const UserCard = ({ user, onSwipe }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const controls = useAnimation();
  const dispatch = useDispatch();
  const [swiping, setSwiping] = useState(false);
  

  const handleSendRequest = async (status) => {
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(_id));  // Remove user from feed after action
      onSwipe();  // Move to next user
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  const handleSwipe = async (direction) => {
    setSwiping(true);
    await controls.start({
      x: direction === "left" ? -1000 : 1000,
      rotate: direction === "left" ? -20 : 20,
      transition: { duration: 0.5 }
    });
    await handleSendRequest(direction === "left" ? "ignored" : "interested");
    controls.set({ x: 0, rotate: 0 }); // Reset card position (optional)
    setSwiping(false);
  };

  return (
    <motion.div
      className="relative w-[300px] sm:w-[400px] md:w-[450px] bg-base-300 shadow-xl rounded-lg overflow-hidden"
      animate={controls}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(e, info) => {
        const threshold = 150;
        if (info.offset.x < -threshold) handleSwipe("left");
        else if (info.offset.x > threshold) handleSwipe("right");
        else controls.start({ x: 0, rotate: 0 }); // Snap back if not enough swipe
      }}
      style={{ cursor: swiping ? "grabbing" : "grab" }}
    >
      <img src={photoUrl} alt="User" className="w-full h-[350px] object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold">{firstName + " " + lastName}</h2>
        {age && gender && <p className="text-gray-500">{age}, {gender}</p>}
        <p className="my-2">{about}</p>
        <div className="flex justify-around mt-4">
          <button
            className="btn btn-error"
            onClick={() => handleSwipe("left")}
            disabled={swiping}
          >
            Ignore
          </button>
          <button
            className="btn btn-success"
            onClick={() => handleSwipe("right")}
            disabled={swiping}
          >
            Interested
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
