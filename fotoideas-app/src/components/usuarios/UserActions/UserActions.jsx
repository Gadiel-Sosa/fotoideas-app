import Button from "../../ui/Button/Button";

import "./UserActions.css";

const UserActions = ({ accion, setAccion, resetForm }) => {

  const tabs = [
    {
      name: "Agregar",
      value: "agregar",
      variant: "primary"
    },
    {
      name: "Actualizar",
      value: "actualizar",
      variant: "primary"
    },
    {
      name: "Borrar",
      value: "borrar",
      variant: "primary"
    }
  ];

  return (
    <div className="user-actions">

      {tabs.map((item) => (

        <Button
          key={item.value}
          variant={
            accion === item.value
              ? item.variant
              : "secondary"
          }
          onClick={() => {
            if (item.value === "agregar") {
              resetForm();
            }
            setAccion(item.value);
          }}
        >
          {item.name}
        </Button>

      ))}

    </div>
  );
};

export default UserActions;