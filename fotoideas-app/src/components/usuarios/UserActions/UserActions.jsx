import { useState } from "react";

import Button from "../../ui/Button/Button";

import UserAddForm from "../UserAddForm/UserAddForm";
import UserUpdateForm from "../UserUpdateForm/UserUpdateForm";
import UserDeleteForm from "../UserDeleteForm/UserDeleteForm";

import "./UserActions.css";

const UserActions = () => {

  const [tab, setTab] = useState("agregar");

  const tabs = [
    {
      name: "Agregar",
      value: "agregar"
    },
    {
      name: "Actualizar",
      value: "actualizar"
    },
    {
      name: "Borrar",
      value: "borrar"
    }
  ];

  return (
    <>
      <div className="user-actions">

        {tabs.map((item) => (

          <Button
            key={item.value}
            variant={
              tab === item.value
                ? "primary"
                : "secondary"
            }
            onClick={() => setTab(item.value)}
          >
            {item.name}
          </Button>

        ))}

      </div>

      {tab === "agregar" && <UserAddForm />}

      {tab === "actualizar" && <UserUpdateForm />}

      {tab === "borrar" && <UserDeleteForm />}
    </>
  );
};

export default UserActions