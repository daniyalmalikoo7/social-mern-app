import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";

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

const ProfileRightBar = () => {
  return (
    <>
      <div className="profileRightbarContainer">
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">New York </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">Madrid </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">Complicated </span>
          </div>
        </div>
      </div>
      <div className="profileRightbarContainer">
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          <div className="rightbarFollowing">
            <img
              src="/assets/person/1.jpeg"
              alt=""
              className="rightbarFollowingImage"
            />
            <span className="rightbarFollowingName">John Carter </span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="/assets/person/2.jpeg"
              alt=""
              className="rightbarFollowingImage"
            />
            <span className="rightbarFollowingName">John Carter </span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="/assets/person/3.jpeg"
              alt=""
              className="rightbarFollowingImage"
            />
            <span className="rightbarFollowingName">John Carter </span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="/assets/person/3.jpeg"
              alt=""
              className="rightbarFollowingImage"
            />
            <span className="rightbarFollowingName">John Carter </span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="/assets/person/3.jpeg"
              alt=""
              className="rightbarFollowingImage"
            />
            <span className="rightbarFollowingName">John Carter </span>
          </div>
          <div className="rightbarFollowing">
            <img
              src="/assets/person/3.jpeg"
              alt=""
              className="rightbarFollowingImage"
            />
            <span className="rightbarFollowingName">John Carter </span>
          </div>
        </div>
      </div>
    </>
  );
};
const Rightbar = ({ profile }) => {
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightBar /> : <HomeRightBar />}
      </div>
    </div>
  );
};

export default Rightbar;
