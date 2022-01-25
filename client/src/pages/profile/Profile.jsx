import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const PublicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user?.coverPicture
                    ? PublicFolder + user.coverPicture
                    : PublicFolder + "/person/noCover.png"
                }
                alt=""
                className="profileCoverImage"
              />
              <img
                src={
                  user.profilePicture
                    ? PublicFolder + user.profilePicture
                    : PublicFolder + "/person/noAvatar.png"
                }
                alt=""
                className="profileUserImage"
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user?.username}</h4>
              <span className="profileInfoDesc">
                {user?.desc || "Love for all,hatred for none."}
              </span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default Profile;
