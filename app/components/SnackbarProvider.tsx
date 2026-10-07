"use client";

import { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type MessageType = "success" | "error" | "warning" | "info";

interface SnackbarContextType {
  showMessage: (message: string, type?: MessageType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<MessageType>("success");

  const showMessage = (message: string, type: MessageType = "success") => {
    setMessage(message);
    setType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  }

  return context;
}
