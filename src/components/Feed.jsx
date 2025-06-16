import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Failed to fetch feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleCardSwipe = () => {
    setCurrentIndex((prev) => prev + 1); 
  };

  // Check if feed is empty or we reached the end
  if (!feed || feed.length === 0) {
    return <h1 className="flex justify-center my-10 text-2xl font-semibold">No New User Found</h1>;
  }


  //wgteyfhyuwedhuiwehfqugyfqh8ewf

  if (currentIndex >= feed.length) {
    return <h1 className="flex justify-center my-10 text-2xl font-semibold">No More Users</h1>;
  }

  return (
    <div className="flex justify-center items-center my-10 px-4 h-screen">
      <UserCard user={feed[currentIndex]} onSwipe={handleCardSwipe} />
    </div>
  );
};

export default Feed;
