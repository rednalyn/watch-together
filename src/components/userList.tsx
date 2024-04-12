import React from "react";
import { useState, useEffect } from "react";
import socket from "../api/socketApi";
import {  playerMessage } from "../interfaces/playerMessages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";



export default function userList() {
  const [users, setUsers] = useState<user[]>([]);

  useEffect(() => {
    socket.on("userlist-changed", async (msg: playerMessage) => {
      setUsers(msg.users!);
    });
    return () => {
      socket.off("userlist-changed");
    };
  }, []);

  return (
    <div>
      <p>Users</p>
      <ul className="p-2">
        {users.map((user, index) => (
          <li key={index}>
            <FontAwesomeIcon icon={faUser} />
            <span className="ml-2">{user.userName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
