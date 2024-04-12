import React from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { useState, useEffect } from "react";
import socket from "../api/socketApi";
import { playerAction, playerMessage } from "../interfaces/playerMessages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface userListProps {
  className?: string;
}

export default function userList({ className }: userListProps) {
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
    <div className={`${className}`}>
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
