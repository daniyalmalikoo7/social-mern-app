import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

const Rightbar = ({ user }) => {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );

  useEffect(() => {
    setFollowed(currentUser.followings.includes(user?._id));
  }, [currentUser, user?._id]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(`/users/friends/${user?._id}`);
        setFriends(friendList.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getFriends();
  }, [user]);

  const handleFollow = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
    } catch (error) {
      console.log(error);
    }
    setFollowed(!followed);
  };

  const HomeRightBar = () => (
    <>
      <div className="birthdayContainer">
        <img className="birthdayImage" src="/assets/gift.png" alt="" />
        <span className="birthdayText">
          <b>John Doe</b> and <b>3 others friend's</b> have birthday today.
        </span>
      </div>
      <img src="/assets/ad.png" alt="" className="rightbarAd" />
      <h4 className="rightbarTitle">Online Friends</h4>
      <ul className="rightbarFriendList">
        {Users.map((user) => (
          <Online user={user} key={user.id} />
        ))}
      </ul>
    </>
  );

  const ProfileRightBar = ({ user }) => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightFollowButton" onClick={handleFollow}>
            {followed ? "UnFollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <div className="profileRightbarContainer">
          <h4 className="rightbarTitle">User information</h4>
          <div className="rightbarInfo">
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">City:</span>
              <span className="rightbarInfoValue">{user.city}</span>
            </div>
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">From:</span>
              <span className="rightbarInfoValue">{user.from} </span>
            </div>
            <div className="rightbarInfoItem">
              <span className="rightbarInfoKey">Relationship:</span>
              <span className="rightbarInfoValue">
                {user.status === 1
                  ? "Single"
                  : user.status === 2
                  ? "Married"
                  : "Complicated"}
              </span>
            </div>
          </div>
        </div>
        <div className="profileRightbarContainer">
          <h4 className="rightbarTitle">User Friends</h4>
          {friends?.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowings">
                <div className="rightbarFollowing">
                  <img
                    src={
                      friend.profilePicture
                        ? PublicFolder + friend.profilePicture
                        : PublicFolder + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImage"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightBar user={user} /> : <HomeRightBar />}
      </div>
    </div>
  );
};

export default Rightbar;
