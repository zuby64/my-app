import React from "react";

const Messagebox = ({
  children,
  variant,
}: {
  children: any;
  variant: string;
}) => {
  return (
    <div className={`alert alert-${variant || "info"}   `}>{children}</div>
  );
};

export default Messagebox;
