import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setAuthenticated } from "~/redux/actions/UserActions";
import { readFile } from "../../lib/fileAction";
import { setActiveSideBar } from "../../redux/actions/appActions";
import { setAllMail, setEnvelope } from "../../redux/actions/MailList";
const os = require("os");
const homedir = os.homedir();
var fs = require("fs");
const path = require("path");
let appPath = "luca";
function SideElementsComp({
  index,
  label,
  Icon,
  active,
  link,
  bottom,
  userHome,
  user,
}) {
  const [visible] = useState(false);
  const dispatch = useDispatch();

  function LogOut() {
    try {
      fs.rmSync(path.join(homedir, appPath, userHome), {
        recursive: true,
        force: true,
      });
      let allusers = JSON.parse(readFile("userslist"));
      let index = allusers.indexOf(user);
      allusers.splice(index, 1);
      if (allusers?.length < 1) {
        dispatch(setAuthenticated(false));
      }
      dispatch(setEnvelope([]));
      dispatch(setAllMail([]));
    } catch (error) {
      alert("error logging out");
    }
  }

  return (
    <Link
      to={{
        pathname: !bottom
          ? label?.toLowerCase().includes("inbox")
            ? "/"
            : `/folder/:${label}`
          : link
          ? link
          : "/",
        state: link,
      }}
      state={link}
      onClick={() => {
        if (label.toLowerCase().includes("logout")) {
          LogOut();
        } else {
          dispatch(setActiveSideBar(label));
        }
      }}
      className={`${
        active === label
          ? "border-l border-l-primary shadow-2xl bg-SideBarIconActiveBackground"
          : "opacity-100 "
      }  my-3    mr-2 rounded-lg  cursor-pointer opacity-90 group [transform:translateZ(0)]before:bg-sky-600 before:bottom-0 before:left-0 before:h-full before:w-full before:-translate-x-full hover:before:translate-x-0 before:transition before:ease-in-out before:duration-500    no-underline  `}
    >
      <div className="flex justify-between flex-row items-center ">
        <div
          className={`z-50 rounded-md  items-center flex flex-row p-1   justify-self-start transform  duration-300 ease-in-out ${
            visible && " "
          }`}
        >
          {Icon && (
            <Icon
              className={` ${
                active == label
                  ? "text-SideBarIconText bg-MailCardBackground"
                  : "  bg-SideBarIconActiveBackground text-text"
              } p-2 rounded-lg shadow-lg group-hover:bg-MailCardBackground transition ease-in-out duration-500  `}
              size={30}
            />
          )}

          <div>
            <span className="text-text capitalize    font-semibold pl-2  no-underline ">
              {label}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default SideElementsComp;
