const Notification = ({ notification }) => {
  if (!notification) return null;
  const { message, className } = notification;
  const style = {
    fontSize: 16,
    color: "green",
    border: "1px solid green",
    borderRadius: 5,
    width: "fit-content",
    padding: "3px 5px",
    marginBottom: 10,
  };

  if (className === "error") {
    style.color = "red";
    style.borderColor = "red";
  }

  return (
    <div className={className} style={style}>
      {message}
    </div>
  );
};

export default Notification;
